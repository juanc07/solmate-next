import { NextRequest, NextResponse } from "next/server";
import { 
  Connection, 
  PublicKey, 
  Keypair, 
  LAMPORTS_PER_SOL, 
  SystemProgram, 
  Transaction 
} from "@solana/web3.js";

// Establish a connection to the Solana Devnet
const connection = new Connection(process.env.RPC_URL!, "confirmed");

// Load the faucet wallet from the private key stored in environment variables
const faucetKeypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(process.env.PRIVATE_KEY!))
);

export async function POST(req: NextRequest) {
  try {
    const { recipient } = await req.json();

    if (!recipient) {
      return NextResponse.json({ error: "Recipient address is required." }, { status: 400 });
    }

    // Validate the recipient's address
    const recipientPublicKey = new PublicKey(recipient);

    // Create a transaction to transfer 0.1 SOL from the faucet wallet to the recipient
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: faucetKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports: 0.1 * LAMPORTS_PER_SOL, // Amount to transfer
      })
    );

    // Sign the transaction with the faucet wallet
    const signature = await connection.sendTransaction(transaction, [faucetKeypair]);

    // Wait for confirmation
    await connection.confirmTransaction(signature, "confirmed");

    return NextResponse.json({ message: "0.1 SOL sent to your wallet!" }, { status: 200 });
  } catch (error) {
    console.error("Transaction failed:", error);
    return NextResponse.json({ error: "Failed to send SOL." }, { status: 500 });
  }
}
