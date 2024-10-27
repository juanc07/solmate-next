"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/custom/server/Layout";
import Portfolio from "@/components/custom/client/Portfolio";
import { useWallet } from "@solana/wallet-adapter-react"; // Import wallet adapter
import { useRouter } from "next/navigation"; // Import router for navigation
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

const SOL_TO_USD_RATE = 22.5; // Placeholder: You can replace this with a real-time exchange rate API

const PortfolioPage = () => {
  const { publicKey, connected, wallet } = useWallet(); // Access wallet state
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const router = useRouter(); // Initialize router for navigation

  // Redirect to home if the wallet is not connected
  useEffect(() => {
    if (!connected) {
      console.log("Wallet not connected. Redirecting to home...");
      router.replace("/"); // Redirect to home page
    }
  }, [connected, router]);

  // Register a disconnect event listener
  useEffect(() => {
    const handleDisconnect = () => {
      console.log("Wallet disconnected. Redirecting to home...");
      router.replace("/"); // Redirect to home page
    };

    if (wallet?.adapter) {
      wallet.adapter.on("disconnect", handleDisconnect);
    }

    // Cleanup the listener on component unmount
    return () => {
      if (wallet?.adapter) {
        wallet.adapter.off("disconnect", handleDisconnect);
      }
    };
  }, [wallet, router]);

  // Fetch SOL balance on wallet connect
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const connection = new Connection(clusterApiUrl("mainnet-beta")); // Mainnet connection
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

  // Compute the USD equivalent
  const usdEquivalent = solBalance ? solBalance * SOL_TO_USD_RATE : 0;

  // Prevent rendering if not connected (during redirect)
  if (!connected) return null;

  return (
    <Layout>
      <Portfolio 
        walletAddress={publicKey?.toString() || ""} 
        solBalance={solBalance} 
        usdEquivalent={usdEquivalent} 
      />
    </Layout>
  );
};

export default PortfolioPage;
