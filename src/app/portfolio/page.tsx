"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/custom/server/Layout";
import Portfolio from "@/components/custom/client/Portfolio";
import { useWallet } from "@solana/wallet-adapter-react"; // Import wallet adapter
import { useRouter } from "next/navigation"; // Import router for navigation
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper"; // Import the helper class

const PortfolioPage = () => {
  const { publicKey, connected, wallet } = useWallet(); // Access wallet state
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number>(0);
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

  // Fetch SOL price and balance on wallet connect
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const price = await SolanaPriceHelper.getTokenPriceInUSD("SOL");
        setSolPrice(price);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };

    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const connection = new Connection(clusterApiUrl("devnet"));
          const balance = await connection.getBalance(new PublicKey(publicKey));
          setSolBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error("Failed to fetch SOL balance:", error);
        }
      }
    };

    if (connected) {
      fetchSolPrice();
      fetchBalance();
    }
  }, [connected, publicKey]);

  // Compute the USD equivalent using the helper class
  const usdEquivalent = solBalance ? solBalance * solPrice : 0;

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
