import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";

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
    const env = process.env.SOLANA_ENV || "mainnet-beta";
    setSolanaEnvironment(env as SolanaEnvironment);
    console.log(`Using Solana environment: ${env}`);

    const publicKey = new PublicKey(publicKeyParam);
    const connection = new Connection(getSolanaEndpoint());

    // Fetch SOL balance
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / 1e9; // Convert lamports to SOL

    // Fetch token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
    );

    const tokens = tokenAccounts.value.map(({ account }) => {
      const info = account.data.parsed.info;
      const mint = info.mint;
      const balance = info.tokenAmount.uiAmount || 0;

      return { mint, balance };
    });

    // Return both SOL balance and tokens in the response
    return NextResponse.json({ solBalance, tokens });
  } catch (error) {
    console.error("Error fetching data from Solana:", error);
    return NextResponse.json(
      { error: "Failed to fetch Solana data" },
      { status: 500 }
    );
  }
}
