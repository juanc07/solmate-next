"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Layout from "@/components/custom/server/Layout";
import Dashboard from "@/components/custom/client/Dashboard";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Use a UI component for notification
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const WSOL_ID = "So11111111111111111111111111111111111111112";

const DashboardPage = () => {
  //const {network} = useWalletContext();
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [usdEquivalent, setUsdEquivalent] = useState<number>(0);
  const [loading, setLoading] = useState(false); // Track loading state
  const hasFetchedData = useRef(false);
  const [networkMismatch, setNetworkMismatch] = useState(false); // Track network mismatch
  const router = useRouter();

  const fetchSolBalanceAndPrice = useCallback(async () => {
    if (!connected || !publicKey || hasFetchedData.current) return;
    setLoading(true); // Start loading

    try {

      const response = await fetch(
        `/api/solana-data?publicKey=${publicKey.toString()}`
      );

      if (!response.ok) throw new Error("Failed to fetch SOL balance");
      const { solBalance } = await response.json();

      const price = await SolanaPriceHelper.getTokenPriceInUSD("SOL",WSOL_ID);

      const usdValue = solBalance * price;
      setSolBalance(solBalance);
      setSolPrice(price);
      setUsdEquivalent(usdValue);

      hasFetchedData.current = true;
    } catch (error) {

      console.error("Error fetching SOL balance or price:", error);

      try {
        // Attempt to retrieve the message from error, assuming it's an Error instance
        const message = (error instanceof Error ? error.message : String(error)).trim();

        console.log("Error message (processed):", message);

        // Check if the message contains "network is not defined"
        if (message.includes("network is not defined")) {
          console.log("Network mismatch detected!");
          setNetworkMismatch(true);
        }

        // Optional exact match check
        if (message === "network is not defined") {
          console.log("Simple approach works!");
          setNetworkMismatch(true);
        }

      } catch (secondaryError) {
        console.error("Failed to process error message:", secondaryError);
      }

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

  // Handle click to dismiss the alert and navigate to homepage
  const handleClick = () => {
    setNetworkMismatch(false); // Hide the alert
    router.push("/"); // Redirect to homepage
  };

  return (
    <Layout>
      {!connected ? (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-full max-w-lg">
          <Alert className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-md shadow-md">
            <AlertTitle className="font-semibold">Wallet Not Connected</AlertTitle>
            <AlertDescription>Please connect your wallet to continue.</AlertDescription>
          </Alert>
        </div>
      ) : networkMismatch ? (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-full max-w-lg">
          <Alert className="bg-red-100 border-l-4 border-red-500 text-red-900 p-4 rounded-md shadow-md">
            <AlertTitle className="font-semibold">Network Mismatch</AlertTitle>
            <AlertDescription>
              Please switch to the correct Solana network in your wallet (expected: {process.env.NEXT_PUBLIC_SOLANA_ENV}).
            </AlertDescription>
            <Button onClick={handleClick} className="mt-4">
              OK
            </Button>
          </Alert>
        </div>
      ) : (
        <Dashboard
          walletAddress={publicKey?.toString() || ""}
          solBalance={solBalance}
          usdEquivalent={usdEquivalent}
          loading={loading}
        />
      )}
    </Layout>
  );
};

export default DashboardPage;
