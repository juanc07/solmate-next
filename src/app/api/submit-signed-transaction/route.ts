import { NextRequest, NextResponse } from "next/server";
import { Connection, clusterApiUrl, VersionedTransaction } from "@solana/web3.js";
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";

const ENV = process.env.NEXT_PUBLIC_SOLANA_ENV || "mainnet-beta";
setSolanaEnvironment(ENV as SolanaEnvironment);

const connection = new Connection(getSolanaEndpoint(), "confirmed");

export async function POST(req: NextRequest) {
  try {
    const { signedTransaction } = await req.json();
    if (!signedTransaction) {
      return NextResponse.json({ error: "Signed transaction is required." }, { status: 400 });
    }

    // Decode the signed transaction from base64
    const transactionBuffer = Uint8Array.from(Buffer.from(signedTransaction, "base64"));
    const transaction = VersionedTransaction.deserialize(transactionBuffer);

    // Send the transaction to the Solana network
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    // Confirm the transaction
    await connection.confirmTransaction(signature, "confirmed");

    return NextResponse.json({ message: "Transaction submitted successfully!", signature }, { status: 200 });
  } catch (error: any) {
    if (error.logs) {
      console.error("Transaction Logs:", error.logs);
    }
    console.error("Transaction submission failed:", error);
    return NextResponse.json({ error: "Failed to submit the transaction.", details: error.message }, { status: 500 });
  }
}
