"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/custom/server/Layout";
import Portfolio from "@/components/custom/client/Portfolio";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import { obfuscatePublicKey } from "@/lib/helper";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PortfolioPage = () => {
  const { publicKey, connected, wallet } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [usdEquivalent, setUsdEquivalent] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false); // Track dialog visibility
  const hasFetchedData = useRef(false);
  const router = useRouter();

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
      setLoading(false);
    }
  }, [connected, publicKey]);

  // Redirect if the wallet is not connected
  const handleRedirect = useCallback(() => {
    router.replace("/");
  }, [router]);

  useEffect(() => {
    if (connected && publicKey) {
      fetchSolBalanceAndPrice();
    } else {
      setShowDialog(true); // Show dialog if not connected
    }
  }, [connected, publicKey, fetchSolBalanceAndPrice]);

  useEffect(() => {
    const handleDisconnect = () => handleRedirect();

    if (wallet?.adapter) {
      wallet.adapter.on("disconnect", handleDisconnect);
    }

    return () => {
      wallet?.adapter?.off("disconnect", handleDisconnect);
    };
  }, [wallet, handleRedirect]);

  useEffect(() => {
    if (!connected) {
      setSolBalance(null);
      setSolPrice(null);
      setUsdEquivalent(0);
    }
  }, [connected]);

  return (
    <>
      {/* Wallet Connection Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wallet Not Connected</DialogTitle>
          </DialogHeader>
          <p>Please connect your wallet to proceed.</p>
          <DialogTrigger asChild>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowDialog(false)}
            >
              Okay
            </button>
          </DialogTrigger>
        </DialogContent>
      </Dialog>

      <Layout>
        <Portfolio
          walletAddress={publicKey?.toString() || ""}
          solBalance={solBalance}
          usdEquivalent={usdEquivalent}
          loading={loading}
        />
      </Layout>
    </>
  );
};

export default PortfolioPage;
