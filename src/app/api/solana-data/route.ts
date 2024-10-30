import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import {
    setSolanaEnvironment,
    getSolanaEndpoint,
    SolanaEnvironment,
  } from "@/lib/config"; // Config utilities

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicKeyParam = searchParams.get("publicKey");

  if (!publicKeyParam) {
    return NextResponse.json(
      { error: "Public key is required" },
      { status: 400 }
    );
  }

  try {
    const env = process.env.SOLANA_ENV || "devnet";
    setSolanaEnvironment(env as SolanaEnvironment);
    console.log(`Using Solana environment: ${env}`);

    // Convert the public key string to a PublicKey instance
    const publicKey = new PublicKey(publicKeyParam);

    const connection = new Connection(getSolanaEndpoint());

    // Fetch the balance using the PublicKey object
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / 1e9; // Convert lamports to SOL

    return NextResponse.json({ solBalance });
  } catch (error) {
    console.error("Error fetching data from Solana:", error);
    return NextResponse.json(
      { error: "Failed to fetch Solana data" },
      { status: 500 }
    );
  }
}
