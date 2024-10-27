"use client";

import { useRouter } from "next/navigation"; // Client-side routing
import WalletInfoSection from "@/components/custom/client/section/WalletInfoSection";
import Sidebar from "@/components/custom/client/Sidebar";
import PortfolioSection from "@/components/custom/client/section/PortfolioSection";
import { useState, useEffect } from "react";
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

  // Redirect to home if wallet is not connected on load or on back navigation
  useEffect(() => {
    const checkConnection = () => {
      if (!connected) {
        console.log("Wallet not connected. Redirecting to home...");
        router.replace("/"); // Redirect to home page
      }
    };

    checkConnection(); // Check on component mount

    // Handle back/forward browser navigation
    const handlePopState = () => {
      console.log("Navigated back. Checking wallet connection...");
      checkConnection();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [connected, router]);

  // Register the disconnect event listener
  useEffect(() => {
    const handleDisconnect = () => {
      console.log("Wallet disconnected. Redirecting to home...");
      router.replace("/"); // Redirect to home page
    };

    if (wallet?.adapter) {
      wallet.adapter.on("disconnect", handleDisconnect);
    }

    return () => {
      if (wallet?.adapter) {
        wallet.adapter.off("disconnect", handleDisconnect);
      }
    };
  }, [wallet, router]);

  // Handle sidebar collapse on window resize
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent rendering if the wallet is not connected
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
            usdEquivalent={usdEquivalent}
          />
          <PortfolioSection tokens={tokens} />
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
