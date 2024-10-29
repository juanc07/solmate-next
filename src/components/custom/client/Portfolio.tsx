"use client";

import { useRouter } from "next/navigation"; // Client-side routing
import WalletInfoSection from "@/components/custom/client/section/WalletInfoSection";
import Sidebar from "@/components/custom/client/Sidebar";
import PortfolioSection from "@/components/custom/client/section/PortfolioSection";
import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react"; // Solana Wallet Adapter

// Dummy token data
const tokens = [
  { name: "Solana", symbol: "SOL", balance: 10.5, change24h: 2.3 },
  { name: "USDC", symbol: "USDC", balance: 250.0, change24h: 0.1 },
  { name: "Raydium", symbol: "RAY", balance: 100, change24h: -1.4 },
];

const Portfolio = ({
  walletAddress,
  solBalance,
  usdEquivalent,
}: {
  walletAddress: string;
  solBalance: number | null;
  usdEquivalent: number | null;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { connected, wallet } = useWallet();
  const router = useRouter();

  // Memoized function to handle redirection
  const redirectToHome = useCallback(() => {
    console.log("Wallet not connected. Redirecting to home...");
    router.replace("/"); // Redirect to home page
  }, [router]);

  // Handle wallet connection status and back navigation
  useEffect(() => {
    if (!connected) {
      redirectToHome();
    }

    const handlePopState = () => {
      console.log("Navigated back. Checking wallet connection...");
      if (!connected) {
        redirectToHome();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [connected, redirectToHome]);

  // Register wallet disconnect event listener
  useEffect(() => {
    const handleDisconnect = () => {
      console.log("Wallet disconnected. Redirecting to home...");
      redirectToHome();
    };

    if (wallet?.adapter) {
      wallet.adapter.on("disconnect", handleDisconnect);
    }

    return () => {
      if (wallet?.adapter) {
        wallet.adapter.off("disconnect", handleDisconnect);
      }
    };
  }, [wallet, redirectToHome]);

  // Handle sidebar collapse on window resize
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Safely display USD equivalent even if `null`
  const displayUsdEquivalent = usdEquivalent ?? 0;

  // Prevent rendering if wallet is not connected
  if (!connected) return null;

  return (
    <div className="h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-60"
        } bg-gray-800 dark:bg-gray-900`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-6 sm:p-8 md:p-10 lg:p-12 space-y-8">
          <WalletInfoSection
            walletAddress={walletAddress}
            solBalance={solBalance}
            usdEquivalent={displayUsdEquivalent} // Use safe value
          />
          <PortfolioSection tokens={tokens} />
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
