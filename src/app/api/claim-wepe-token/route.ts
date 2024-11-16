import { NextRequest, NextResponse } from "next/server";
import { 
  Connection, 
  PublicKey, 
  Keypair, 
  VersionedTransaction, 
  TransactionMessage, 
  clusterApiUrl 
} from "@solana/web3.js";
import { createTransferInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { solmateSupabase } from "@/lib/supabaseClient";

const connection = new Connection(process.env.RPC_URL || clusterApiUrl("devnet"), "confirmed");
const faucetKeypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(process.env.PRIVATE_KEY!))
);
const MEME_TOKEN_MINT = new PublicKey("CmXRwQ7hGoErWgKemj3PgKQnqWdB4vFqtFPELaTwDdcx");
const TOKEN_AMOUNT = 4000;

export async function POST(req: NextRequest) {
  try {
    const { recipient } = await req.json();
    if (!recipient) {
      return NextResponse.json({ error: "Recipient address is required." }, { status: 400 });
    }

    const recipientPublicKey = new PublicKey(recipient);

    // Check Supabase to prevent multiple claims
    const { data: claimData } = await solmateSupabase
      .from("claims")
      .select("*")
      .eq("public_key", recipientPublicKey.toString());

    if (claimData && claimData.length > 0) {
      return NextResponse.json({ error: "You have already claimed your tokens." }, { status: 400 });
    }

    // Get the recipient's associated token account
    const recipientTokenAccount = await getAssociatedTokenAddress(
      MEME_TOKEN_MINT,
      recipientPublicKey
    );

    const senderTokenAccount = await getAssociatedTokenAddress(
      MEME_TOKEN_MINT,
      faucetKeypair.publicKey
    );

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      senderTokenAccount,
      recipientTokenAccount,
      faucetKeypair.publicKey,
      TOKEN_AMOUNT
    );

    // Create a transaction message
    const message = new TransactionMessage({
      payerKey: faucetKeypair.publicKey,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
      instructions: [transferInstruction],
    }).compileToV0Message();

    // Create a VersionedTransaction
    const transaction = new VersionedTransaction(message);

    // Simulate the transaction
    const simulation = await connection.simulateTransaction(transaction, {
      sigVerify: false,
      replaceRecentBlockhash: true,
    });

    if (simulation.value.err) {
      console.error("Simulation failed:", simulation.value.err);
      return NextResponse.json({ error: "Transaction simulation failed." }, { status: 400 });
    }

    // If simulation succeeds, sign the transaction
    transaction.sign([faucetKeypair]);

    // Send the transaction
    const signature = await connection.sendTransaction(transaction);
    await connection.confirmTransaction(signature, "confirmed");

    // Record claim in Supabase
    const { error } = await solmateSupabase
      .from("claims")
      .insert([{ public_key: recipientPublicKey.toString(), claimed: true }]);

    if (error) throw error;

    return NextResponse.json({ message: `${TOKEN_AMOUNT} tokens sent to your wallet!` }, { status: 200 });
  } catch (error) {
    console.error("Transaction failed:", error);
    return NextResponse.json({ error: "Failed to send tokens." }, { status: 500 });
  }
}
