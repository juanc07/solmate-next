"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "@/components/custom/client/Sidebar";
import { useRouter } from "next/navigation";
import SolFaucetContent from "@/components/custom/client/section/SolFaucetContent";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";

const SolFaucet = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [usdEquivalent, setUsdEquivalent] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const hasFetchedData = useRef(false);  

  const fetchSolBalanceAndPrice = useCallback(async () => {
    if (!connected || !publicKey || hasFetchedData.current) return;
    setLoading(true);

    try {
      const response = await fetch(
        `/api/solana-data?publicKey=${publicKey.toString()}`
      );
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
      setSolPrice(null);
      setUsdEquivalent(0);
    } finally {
      setLoading(false);
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
      hasFetchedData.current = false; // Reset data flag on disconnection
    }
  }, [connected]);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!connected) router.replace("/");
  }, [connected, router]);

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      <Sidebar/>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-auto p-6 sm:p-8 md:p-10 lg:p-12">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : (
            <SolFaucetContent solBalance={solBalance} usdEquivalent={usdEquivalent} />
          )}
        </div>
      </main>
    </div>
  );
};

export default SolFaucet;
