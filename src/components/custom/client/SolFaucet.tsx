"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/custom/client/Sidebar";
import { useRouter } from "next/navigation"; // Next.js router
import SolFaucetContent from "@/components/custom/client/section/SolFaucetContent";
import { useWallet } from "@solana/wallet-adapter-react"; // Solana Wallet Adapter
import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper"; // Import the helper

import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config"; // Config helpers

const SolFaucet = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number>(0);

  // Force the Solana environment to use "devnet"
  useEffect(() => {
    setSolanaEnvironment("devnet" as SolanaEnvironment);
    console.log(`Forcing Solana environment: devnet`);
  }, []);

  // Helper to save data to sessionStorage
  const saveToSession = (key: string, value: any) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  // Helper to load data from sessionStorage
  const loadFromSession = (key: string) => {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  };

  // Fetch SOL price from helper with caching
  const fetchSolPrice = useCallback(async () => {
    const cachedPrice = loadFromSession("solPrice");
    if (cachedPrice) {
      console.log("Using cached SOL price:", cachedPrice);
      setSolPrice(cachedPrice);
      return;
    }

    try {
      const price = await SolanaPriceHelper.getTokenPriceInUSD("SOL");
      console.log("Fetched new SOL price:", price);
      setSolPrice(price);
      saveToSession("solPrice", price); // Cache the price
    } catch (error) {
      console.error("Error fetching SOL price:", error);
    }
  }, []);

  // Fetch SOL balance with caching
  const fetchSolBalance = useCallback(async () => {
    if (!publicKey) return;

    const cachedBalance = loadFromSession("solBalance");
    if (cachedBalance) {
      console.log("Using cached SOL balance:", cachedBalance);
      setSolBalance(cachedBalance);
      return;
    }

    try {
      const connection = new Connection(getSolanaEndpoint());
      const balance = await connection.getBalance(new PublicKey(publicKey));
      const solBalanceValue = balance / 1e9; // Convert lamports to SOL
      console.log("Fetched new SOL balance:", solBalanceValue);
      setSolBalance(solBalanceValue);
      saveToSession("solBalance", solBalanceValue); // Cache the balance
    } catch (error) {
      console.error("Failed to fetch SOL balance:", error);
    }
  }, [publicKey]);

  // Fetch balance and price on connection or page reload
  useEffect(() => {
    if (connected) {
      fetchSolPrice();
      fetchSolBalance();
    }
  }, [connected, publicKey, fetchSolPrice, fetchSolBalance]);

  // Calculate USD equivalent using the fetched SOL price
  const usdEquivalent = solBalance ? solBalance * solPrice : 0;

  // Handle sidebar collapse on window resize
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect to home if the wallet is not connected
  useEffect(() => {
    if (!connected) {
      router.replace("/");
    }
  }, [connected, router]);

  // Prevent rendering if wallet is not connected
  if (!connected) return null;

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      <aside
        className={`transition-all duration-300 flex-shrink-0 ${
          isCollapsed ? "w-20" : "w-60"
        } bg-gray-800 dark:bg-gray-900`}
        style={{ height: "100vh" }}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-auto p-6 sm:p-8 md:p-10 lg:p-12">
          <SolFaucetContent solBalance={solBalance} usdEquivalent={usdEquivalent} />
        </div>
      </main>
    </div>
  );
};

export default SolFaucet;
