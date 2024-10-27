"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/custom/server/Layout";
import Dashboard from "@/components/custom/client/Dashboard";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

// Example conversion rate (replace with dynamic API call if needed)
const SOL_TO_USD_RATE = 170.36;

const DashboardPage = () => {
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection(clusterApiUrl("devnet"));
      const fetchBalance = async () => {
        try {
          const balance = await connection.getBalance(new PublicKey(publicKey));
          const sol = balance / 1e9; // Convert lamports to SOL
          setSolBalance(sol); // Even if zero, it will now pass 0
        } catch (error) {
          console.error("Error fetching SOL balance:", error);
          setSolBalance(0); // Ensure it defaults to 0 on failure
        }
      };

      fetchBalance();
    } else {
      setSolBalance(0); // Set balance to 0 if not connected
    }
  }, [connected, publicKey]);

  const walletAddress = connected && publicKey ? publicKey.toString() : "";

  return (
    <Layout>
      <Dashboard 
        walletAddress={walletAddress} 
        solBalance={solBalance} 
        usdEquivalent={solBalance ? solBalance * SOL_TO_USD_RATE : 0} 
      />
    </Layout>
  );
};

export default DashboardPage;
