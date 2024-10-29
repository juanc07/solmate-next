"use client";

import { useRouter } from "next/navigation";
import GreetingSection from "@/components/custom/client/section/GreetingSection";
import Sidebar from "@/components/custom/client/Sidebar";
import PortfolioSection from "@/components/custom/client/section/PortfolioSection";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

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
  const { connected, wallet } = useWallet();
  const router = useRouter();

  // Redirect to home if wallet is not connected
  useEffect(() => {
    if (!connected) {
      console.log("Wallet not connected. Redirecting to home...");
      router.replace("/");
    }
  }, [connected, router]);

  // Register the disconnect event listener
  useEffect(() => {
    const handleDisconnect = () => {
      console.log("Wallet disconnected. Redirecting to home...");
      router.replace("/");
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

  // Safely display USD equivalent even if `null`
  const displayUsdEquivalent = usdEquivalent !== null ? usdEquivalent : 0;

  if (!connected) return null; // Prevent rendering if not connected

  return (
    <div className="flex h-screen transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-60"
        } bg-gray-800 dark:bg-gray-900 h-full`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-grow overflow-auto p-6 sm:p-8 md:p-10 lg:p-12 space-y-8">
          <GreetingSection
            walletAddress={walletAddress}
            solBalance={solBalance}
            usdEquivalent={displayUsdEquivalent} // Use safe display value
          />
          <PortfolioSection tokens={tokens} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
