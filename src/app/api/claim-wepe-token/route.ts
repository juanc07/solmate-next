import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  PublicKey,
  Keypair,
  VersionedTransaction,
  TransactionMessage,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { solmateSupabase } from "@/lib/supabaseClient";
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";

const ENV = process.env.NEXT_PUBLIC_SOLANA_ENV || "mainnet-beta";
setSolanaEnvironment(ENV as SolanaEnvironment);

const connection = new Connection(getSolanaEndpoint(), "confirmed");

// Faucet wallet configuration
const faucetKeypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(process.env.PRIVATE_KEY!))
);
const MEME_TOKEN_MINT = new PublicKey("CmXRwQ7hGoErWgKemj3PgKQnqWdB4vFqtFPELaTwDdcx");
const TOKEN_AMOUNT = 4000; // Amount in user-friendly units (not lamports)
const TOKEN_DECIMALS = 6; // Adjust based on token's decimals

export async function POST(req: NextRequest) {
  try {
    const { recipient } = await req.json();
    if (!recipient) {
      return NextResponse.json({ error: "Recipient address is required." }, { status: 400 });
    }

    const recipientPublicKey = new PublicKey(recipient);

    // Check Supabase to prevent multiple claims
    const { data: claimData, error: fetchError } = await solmateSupabase
      .from("claims")
      .select("*")
      .eq("public_key", recipientPublicKey.toString());

    if (fetchError) {
      console.error("Error fetching claim data from Supabase:", fetchError);
      return NextResponse.json({ error: "Error verifying claim status." }, { status: 500 });
    }

    if (claimData && claimData.length > 0) {
      return NextResponse.json({ error: "You have already claimed your tokens." }, { status: 400 });
    }

    // Scale the token amount to match the token's decimals
    const scaledTokenAmount = TOKEN_AMOUNT * Math.pow(10, TOKEN_DECIMALS);

    // Get the recipient's associated token account
    const recipientTokenAccount = await getAssociatedTokenAddress(
      MEME_TOKEN_MINT,
      recipientPublicKey
    );

    const senderTokenAccount = await getAssociatedTokenAddress(
      MEME_TOKEN_MINT,
      faucetKeypair.publicKey
    );

    // Ensure the faucet wallet has enough tokens
    const senderAccountInfo = await getAccount(connection, senderTokenAccount);
    if (senderAccountInfo.amount < scaledTokenAmount) {
      return NextResponse.json(
        { error: "Insufficient token balance in the faucet wallet." },
        { status: 400 }
      );
    }

    const instructions = [];

    // Check if recipient token account exists, create it if necessary
    try {
      await getAccount(connection, recipientTokenAccount);
    } catch {
      console.log("Recipient token account not found. Adding creation instruction...");
      const createAccountInstruction = createAssociatedTokenAccountInstruction(
        recipientPublicKey, // Payer
        recipientTokenAccount, // Associated Token Account
        recipientPublicKey, // Owner
        MEME_TOKEN_MINT // Mint
      );
      instructions.push(createAccountInstruction);
    }

    // Add transfer instruction
    const transferInstruction = createTransferInstruction(
      senderTokenAccount,
      recipientTokenAccount,
      faucetKeypair.publicKey,
      scaledTokenAmount
    );
    instructions.push(transferInstruction);

    // Create the transaction message
    const message = new TransactionMessage({
      payerKey: recipientPublicKey, // User pays the fees
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
      instructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(message);

    // Sign the transaction with the faucet's private key for token transfer
    transaction.sign([faucetKeypair]);

    // Return the partially signed transaction to the client
    const serializedTransaction = transaction.serialize();
    return NextResponse.json(
      { transaction: Buffer.from(serializedTransaction).toString("base64") },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Transaction preparation failed:", error);
    return NextResponse.json({ error: "Failed to prepare transaction." }, { status: 500 });
  }
}
