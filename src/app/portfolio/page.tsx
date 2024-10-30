"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation"; // Router for navigation
import Layout from "@/components/custom/server/Layout";
import Portfolio from "@/components/custom/client/Portfolio";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import { obfuscatePublicKey } from "@/lib/helper";

const PortfolioPage = () => {
  const { publicKey, connected, wallet } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [usdEquivalent, setUsdEquivalent] = useState<number>(0);
  const [loading, setLoading] = useState(false); // Track loading state
  const hasFetchedData = useRef(false);
  const router = useRouter();

  // Fetch SOL balance and price from the API route
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

      hasFetchedData.current = true; // Mark data as fetched
    } catch (error) {
      console.error("Error fetching SOL balance or price:", error);
      setSolBalance(0);
      setUsdEquivalent(0);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [connected, publicKey]);

  // Redirect to home if wallet is not connected
  const handleRedirect = useCallback(() => {
    console.log("Wallet not connected. Redirecting to home...");
    router.replace("/");
  }, [router]);

  // Fetch data or redirect based on connection status
  useEffect(() => {
    if (connected && publicKey) {
      fetchSolBalanceAndPrice();
    } else {
      handleRedirect();
    }
  }, [connected, publicKey, fetchSolBalanceAndPrice, handleRedirect]);

  // Register a disconnect event listener
  useEffect(() => {
    const handleDisconnect = () => {
      console.log("Wallet disconnected. Redirecting to home...");
      handleRedirect();
    };

    if (wallet?.adapter) {
      wallet.adapter.on("disconnect", handleDisconnect);
    }

    return () => {
      if (wallet?.adapter) {
        wallet.adapter.off("disconnect", handleDisconnect);
      }
    };
  }, [wallet, handleRedirect]);

  // Reset state on wallet disconnect
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
      <Portfolio
        walletAddress={publicKey?.toString() || ""}
        solBalance={solBalance}
        usdEquivalent={usdEquivalent}
        loading={loading} // Pass loading state to Portfolio
      />
    </Layout>
  );
};

export default PortfolioPage;
