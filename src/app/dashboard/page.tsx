"use client";

import React from "react";
import Layout from "@/components/custom/server/Layout";
import Dashboard from "@/components/custom/client/Dashboard";
import { useWallet } from "@solana/wallet-adapter-react"; // Import wallet adapter

const DashboardPage = () => {
  const { publicKey, connected } = useWallet(); // Access wallet state

  // If the wallet is connected, use the wallet address; otherwise, use an empty string
  const walletAddress = connected && publicKey ? publicKey.toString() : "";

  return (
    <Layout>
      <Dashboard walletAddress={walletAddress} /> {/* Pass address as prop */}
    </Layout>
  );
};

export default DashboardPage;
