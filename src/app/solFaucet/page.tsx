"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/custom/server/Layout";
import SolFaucetContent from "@/components/custom/client/SolFaucetContent";
import { useWallet } from "@solana/wallet-adapter-react"; // Solana Wallet Adapter
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

const SOL_TO_USD_RATE = 22.5; // Placeholder rate

const SolFaucetPage = () => {
  const { publicKey, connected } = useWallet(); // Access wallet state
  const [solBalance, setSolBalance] = useState<number | null>(null);

  // Fetch SOL balance when the wallet connects
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const connection = new Connection(clusterApiUrl("devnet")); // Devnet connection
          const balance = await connection.getBalance(new PublicKey(publicKey));
          setSolBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error("Failed to fetch SOL balance:", error);
        }
      }
    };

    if (connected) fetchBalance();
  }, [connected, publicKey]);

  // Calculate USD equivalent of SOL balance
  const usdEquivalent = solBalance ? solBalance * SOL_TO_USD_RATE : 0;

  // Prevent rendering if the wallet is not connected
  if (!connected) return <p>Please connect your wallet to access the faucet.</p>;

  return (
    <Layout>
      <SolFaucetContent 
        solBalance={solBalance} 
        usdEquivalent={usdEquivalent} 
      />
    </Layout>
  );
};

export default SolFaucetPage;
