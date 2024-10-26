"use client";

import React from "react";
import Layout from "@/components/custom/server/Layout";
import { useWallet } from "@solana/wallet-adapter-react"; // Import wallet adapter
import Portfolio from "@/components/custom/client/Portfolio";

const PorfolioPage = () => {
  const { publicKey, connected } = useWallet(); // Access wallet state

  // If the wallet is connected, use the wallet address; otherwise, use an empty string
  const walletAddress = connected && publicKey ? publicKey.toString() : "";

  return (
    <Layout>
      <Portfolio walletAddress={walletAddress} /> {/* Pass address as prop */}
    </Layout>
  );
};

export default PorfolioPage;
