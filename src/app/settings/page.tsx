"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/custom/server/Layout";
import Settings from "@/components/custom/client/Settings";
import { useWallet } from "@solana/wallet-adapter-react"; // Solana Wallet Adapter
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

const SOL_TO_USD_RATE = 22.5; // Placeholder exchange rate

const SettingsPage = () => {
  const { publicKey, connected } = useWallet(); // Access wallet state
  const [solBalance, setSolBalance] = useState<number | null>(null);

  // Fetch SOL balance when wallet connects
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const connection = new Connection(clusterApiUrl("devnet")); // Mainnet connection
          const balance = await connection.getBalance(new PublicKey(publicKey));
          setSolBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error("Failed to fetch SOL balance:", error);
        }
      }
    };

    if (connected) {
      fetchBalance();
    }
  }, [connected, publicKey]);

  // Calculate the USD equivalent of SOL balance
  const usdEquivalent = solBalance ? solBalance * SOL_TO_USD_RATE : 0;

  // Prevent rendering if the wallet is not connected
  if (!connected) return null;

  return (
    <Layout>
      <Settings />
    </Layout>
  );
};

export default SettingsPage;
