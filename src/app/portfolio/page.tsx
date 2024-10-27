"use client";

import React, { useEffect } from "react";
import Layout from "@/components/custom/server/Layout";
import { useWallet } from "@solana/wallet-adapter-react"; // Import wallet adapter
import Portfolio from "@/components/custom/client/Portfolio";
import { useRouter } from "next/navigation"; // Import router for navigation

const PortfolioPage = () => {
  const { publicKey, connected, wallet } = useWallet(); // Access wallet state
  const router = useRouter(); // Initialize router for client-side navigation

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

  // If the wallet is connected, use the wallet address; otherwise, use an empty string
  const walletAddress = connected && publicKey ? publicKey.toString() : "";

  // Prevent rendering the page if the wallet is not connected (during redirect)
  if (!connected) {
    return null;
  }

  return (
    <Layout>
      <Portfolio walletAddress={walletAddress} /> {/* Pass address as prop */}
    </Layout>
  );
};

export default PortfolioPage;
