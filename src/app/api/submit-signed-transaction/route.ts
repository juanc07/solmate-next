import { NextRequest, NextResponse } from "next/server";
import { Connection, VersionedTransaction, PublicKey } from "@solana/web3.js";
import { solmateSupabase } from "@/lib/supabaseClient";
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";

const ENV = process.env.NEXT_PUBLIC_SOLANA_ENV || "mainnet-beta";
setSolanaEnvironment(ENV as SolanaEnvironment);

const connection = new Connection(getSolanaEndpoint(), "confirmed");

export async function POST(req: NextRequest) {
  try {
    const { signedTransaction, recipient } = await req.json();
    if (!signedTransaction || !recipient) {
      return NextResponse.json({ error: "Signed transaction and recipient are required." }, { status: 400 });
    }

    const recipientPublicKey = new PublicKey(recipient);

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

    // Save the claim in Supabase after successful transaction
    const { error: insertError } = await solmateSupabase
      .from("claims")
      .insert([{ public_key: recipientPublicKey.toString(), claimed: true }]);

    if (insertError) {
      console.error("Error saving claim to Supabase:", insertError);
      return NextResponse.json({ error: "Transaction succeeded, but claim saving failed." }, { status: 500 });
    }

    return NextResponse.json({ message: "Transaction submitted and claim saved successfully!", signature }, { status: 200 });
  } catch (error: any) {
    console.error("Transaction submission failed:", error);
    return NextResponse.json({ error: "Failed to submit the transaction.", details: error.message }, { status: 500 });
  }
}
