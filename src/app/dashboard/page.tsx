"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Layout from "@/components/custom/server/Layout";
import Dashboard from "@/components/custom/client/Dashboard";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import { obfuscatePublicKey } from "@/lib/helper";

const DashboardPage = () => {
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [usdEquivalent, setUsdEquivalent] = useState<number>(0);
  const [loading, setLoading] = useState(false); // Track loading state
  const hasFetchedData = useRef(false);

  const fetchSolBalanceAndPrice = useCallback(async () => {
    if (!connected || !publicKey || hasFetchedData.current) return;
    setLoading(true); // Start loading

    try {
      const response = await fetch(`/api/solana-data?publicKey=${publicKey.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch SOL balance");

      const { solBalance } = await response.json();
      const price = await SolanaPriceHelper.getTokenPriceInUSD("SOL");

      const usdValue = solBalance * price;
      setSolBalance(solBalance);
      setSolPrice(price);
      setUsdEquivalent(usdValue);

      hasFetchedData.current = true;
    } catch (error) {
      console.error("Error fetching SOL balance or price:", error);
      setSolBalance(0);
      setUsdEquivalent(0);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [connected, publicKey]);

  useEffect(() => {
    if (connected && publicKey) fetchSolBalanceAndPrice();
  }, [connected, publicKey, fetchSolBalanceAndPrice]);

  useEffect(() => {
    if (!connected) {
      setSolBalance(null);
      setSolPrice(null);
      setUsdEquivalent(0);
    }
  }, [connected]);

  if (!connected) return <div>Please connect your wallet</div>;

  return (
    <Layout>
      <Dashboard
        walletAddress={publicKey?.toString() || ""}
        solBalance={solBalance}
        usdEquivalent={usdEquivalent}
        loading={loading} // Pass loading state to Dashboard
      />
    </Layout>
  );
};

export default DashboardPage;
