"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/custom/client/Sidebar";
import { useRouter } from "next/navigation"; // Next.js router
import SolFaucetContent from "@/components/custom/client/section/SolFaucetContent";
import { useWallet } from "@solana/wallet-adapter-react"; // Solana Wallet Adapter
import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper"; // Import the helper

// Import config helpers for Solana environment management
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";

const SolFaucet = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter(); // Initialize router
  const { publicKey, connected } = useWallet(); // Access wallet state
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number>(0);

  // Force the Solana environment to use "devnet"
  useEffect(() => {
    setSolanaEnvironment("devnet" as SolanaEnvironment); // Force to devnet
    console.log(`Forcing Solana environment: devnet`);
  }, []);

  // Fetch SOL balance and price when the wallet connects
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const price = await SolanaPriceHelper.getTokenPriceInUSD("SOL");
        setSolPrice(price);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };

    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const connection = new Connection(getSolanaEndpoint()); // Use forced devnet endpoint
          const balance = await connection.getBalance(new PublicKey(publicKey));
          setSolBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error("Failed to fetch SOL balance:", error);
        }
      }
    };

    if (connected) {
      fetchSolPrice();
      fetchBalance();
    }
  }, [connected, publicKey]);

  // Calculate USD equivalent using fetched SOL price
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
      router.replace("/"); // Redirect to home page
    }
  }, [connected, router]);

  // Prevent rendering if wallet is not connected
  if (!connected) return null;

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 flex-shrink-0 ${
          isCollapsed ? "w-20" : "w-60"
        } bg-gray-800 dark:bg-gray-900`}
        style={{ height: "100vh" }} // Sidebar takes full height
      >
        <Sidebar isCollapsed={isCollapsed} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-auto p-6 sm:p-8 md:p-10 lg:p-12">
          <SolFaucetContent 
            solBalance={solBalance} 
            usdEquivalent={usdEquivalent} 
          />
        </div>
      </main>
    </div>
  );
};

export default SolFaucet;
