"use client";

import { useRouter } from "next/navigation"; // Client-side routing
import GreetingSection from "@/components/custom/client/section/GreetingSection";
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

const Dashboard = ({
  walletAddress,
  solBalance,
  usdEquivalent,
}: {
  walletAddress: string;
  solBalance: number | null;
  usdEquivalent: number | null;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { connected, wallet } = useWallet(); // Check connection status
  const router = useRouter(); // Initialize router for navigation

  // Redirect to home if wallet is not connected
  useEffect(() => {
    if (!connected) {
      console.log("Wallet not connected. Redirecting to home...");
      router.replace("/"); // Redirect to home page
    }
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

    // Cleanup listener on component unmount
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

  if (!connected) {
    return null; // Prevent rendering until redirect completes
  }

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      <aside className={`transition-all duration-300 ${isCollapsed ? "w-20" : "w-60"}`}>
        <Sidebar isCollapsed={isCollapsed} />
      </aside>
      <main className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 space-y-8">
        <GreetingSection
          walletAddress={walletAddress}
          solBalance={solBalance}
          usdEquivalent={usdEquivalent}
        />
        <PortfolioSection tokens={tokens} />
      </main>
    </div>
  );
};

export default Dashboard;
