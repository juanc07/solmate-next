import { NextResponse } from "next/server";
import { Connection, PublicKey, GetVersionedTransactionConfig } from "@solana/web3.js";
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";
import { solmateSupabase } from "@/lib/supabaseClient";

// Function to fetch token details from Jupiter API
async function getTokenDetails(mint: string) {
    try {
      // Check Supabase for cached token details
      const { data: token, error: fetchError } = await solmateSupabase
        .from("token_details")
        .select("name, symbol")
        .eq("mint", mint)
        .single();
  
      if (token) {
        // If token details are found in Supabase, return them
        return { name: token.name, symbol: token.symbol };
      }
  
      if (fetchError && fetchError.code !== "PGRST116") {
        console.error(`Error fetching token details from Supabase for ${mint}:`, fetchError.message);
      }
  
      // If not found in Supabase, fetch from Jupiter API
      const response = await fetch(`https://tokens.jup.ag/token/${mint}`);
      if (!response.ok) {
        console.error(`Failed to fetch token details for ${mint}: ${response.statusText}`);
        return { name: "Unknown Token", symbol: "UNKNOWN" };
      }
  
      const data = await response.json();
  
      // Save fetched details to Supabase
      const { error: insertError } = await solmateSupabase.from("token_details").upsert([
        {
          mint: mint,
          name: data.name,
          symbol: data.symbol,
        },
      ]);
  
      if (insertError) {
        console.error(`Error saving token details to Supabase for ${mint}:`, insertError.message);
      }
  
      // Return the fetched token details
      return { name: data.name, symbol: data.symbol };
    } catch (error) {
      console.error(`Error fetching token details for ${mint}:`, error);
      return { name: "Unknown Token", symbol: "UNKNOWN" };
    }
  }
  

export async function POST(req: Request) {
    try {
      // Set Solana environment
      const env = process.env.NEXT_PUBLIC_SOLANA_ENV || "mainnet-beta";
      setSolanaEnvironment(env as SolanaEnvironment);
      console.log(`Using Solana environment: ${env}`);
      const connection = new Connection(getSolanaEndpoint());
  
      // Parse request body
      const { wallets } = await req.json();
      if (!Array.isArray(wallets) || wallets.length === 0) {
        return NextResponse.json({ error: "Invalid wallet list" }, { status: 400 });
      }
  
      // Process each wallet
      const results = await Promise.all(
        wallets.map(async (wallet: string) => {
          try {
            const publicKey = new PublicKey(wallet);
  
            // Fetch transaction signatures
            const transactions = await connection.getSignaturesForAddress(publicKey, { limit: 50 });
  
            // Process each transaction
            const activities = [];
            for (const tx of transactions) {
              try {
                const config: GetVersionedTransactionConfig = { maxSupportedTransactionVersion: 0 };
                const details = await connection.getTransaction(tx.signature, config);
  
                if (details && details.meta) {
                  const { postTokenBalances, preTokenBalances, err } = details.meta;
  
                  if (!err && postTokenBalances && preTokenBalances) {
                    const tokenActivities = await Promise.all(
                      postTokenBalances.map(async (balance, idx) => {
                        const mint = balance.mint;
                        const preAmount = preTokenBalances[idx]?.uiTokenAmount?.uiAmount || 0;
                        const postAmount = balance.uiTokenAmount?.uiAmount || 0;
                        const amount = postAmount - preAmount;
  
                        const tokenInfo = await getTokenDetails(mint);
  
                        return {
                          timestamp: details.blockTime
                            ? new Date(details.blockTime * 1000).toISOString()
                            : null,
                          token: tokenInfo.name,
                          symbol: tokenInfo.symbol,
                          mint: mint,
                          amount: Math.abs(amount), // Absolute value of the amount
                          type: amount > 0 ? "buy" : "sell", // Categorize buy/sell
                        };
                      })
                    );
  
                    activities.push(...tokenActivities);
                  }
                }
              } catch (error) {
                console.error(`Error processing transaction ${tx.signature}:`, error);
              }
            }
  
            // Return all activities, including buys and sells
            return { wallet, activities };
          } catch (error) {
            console.error(`Error processing wallet ${wallet}:`, error);
            return { wallet, activities: [] };
          }
        })
      );
  
      return NextResponse.json(results);
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
    }
  }
  
