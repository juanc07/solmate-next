"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Layout from "@/components/custom/server/Layout";
import Dashboard from "@/components/custom/client/Dashboard";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import { obfuscatePublicKey } from "@/lib/helper"; // No need for sanitizeUrl anymore

const DashboardPage = () => {
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [usdEquivalent, setUsdEquivalent] = useState<number>(0);
  const hasFetchedData = useRef(false); // Track if data is already fetched

  // Fetch SOL balance and price only if not fetched before
  const fetchSolBalanceAndPrice = useCallback(async () => {
    if (!connected || !publicKey || hasFetchedData.current) return;

    console.log(`Fetching data for Public Key: ${obfuscatePublicKey(publicKey.toString())}`);

    try {
      // Fetch the SOL balance from the API route
      const response = await fetch(`/api/solana-data?publicKey=${publicKey.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch SOL balance");
      }

      const solBalanceValue = data.solBalance;
      console.log(`Fetched SOL balance: ${solBalanceValue} SOL`);
      setSolBalance(solBalanceValue);

      // Fetch the SOL price
      const price = await SolanaPriceHelper.getTokenPriceInUSD("SOL");
      console.log(`Fetched SOL price: $${price}`);
      setSolPrice(price);

      // Calculate and set USD equivalent
      const usdValue = solBalanceValue * price;
      console.log(`USD Equivalent: $${usdValue}`);
      setUsdEquivalent(usdValue);

      // Mark data as fetched for this session
      hasFetchedData.current = true;
    } catch (error) {
      console.error("Error fetching SOL balance or price:", error);
      setSolBalance(0);
      setUsdEquivalent(0);
    }
  }, [connected, publicKey]);

  // Trigger fetch on wallet connection or public key change
  useEffect(() => {
    fetchSolBalanceAndPrice();
  }, [fetchSolBalanceAndPrice]);

  const walletAddress = publicKey?.toString() || "";

  // Prevent rendering if wallet is not connected
  if (!connected) return null;

  return (
    <Layout>
      <Dashboard
        walletAddress={walletAddress}
        solBalance={solBalance}
        usdEquivalent={usdEquivalent}
      />
    </Layout>
  );
};

export default DashboardPage;
