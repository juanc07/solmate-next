import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

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

    // Request an airdrop of 0.1 SOL
    const transaction = await connection.requestAirdrop(
      recipientPublicKey,
      0.1 * LAMPORTS_PER_SOL
    );

    await connection.confirmTransaction(transaction);

    return NextResponse.json({ message: "0.1 SOL sent to your wallet!" }, { status: 200 });
  } catch (error) {
    console.error("Airdrop failed:", error);
    return NextResponse.json({ error: "Failed to send SOL." }, { status: 500 });
  }
}
