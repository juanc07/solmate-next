"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/custom/server/Layout";
import Dashboard from "@/components/custom/client/Dashboard";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";

const DashboardPage = () => {
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number>(0);

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const price = await SolanaPriceHelper.getTokenPriceInUSD("SOL");
        setSolPrice(price);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };
    fetchSolPrice();
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection(clusterApiUrl("devnet"));
      const fetchBalance = async () => {
        try {
          const balance = await connection.getBalance(publicKey);
          setSolBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error("Error fetching SOL balance:", error);
          setSolBalance(0);
        }
      };
      fetchBalance();
    } else {
      setSolBalance(0);
    }
  }, [connected, publicKey]);

  const walletAddress = publicKey?.toString() || "";

  return (
    <Layout>
      <Dashboard
        walletAddress={walletAddress}
        solBalance={solBalance}
        usdEquivalent={solBalance ? solBalance * solPrice : 0}
      />
    </Layout>
  );
};

export default DashboardPage;
