"use client";

import { useRouter } from "next/navigation";
import GreetingSection from "@/components/custom/client/section/GreetingSection";
import Sidebar from "@/components/custom/client/Sidebar";
import PortfolioSection from "@/components/custom/client/section/PortfolioSection";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const tokens = [
  { name: "Solana", symbol: "SOL", balance: 10.5, change24h: 2.3 },
  { name: "USDC", symbol: "USDC", balance: 250.0, change24h: 0.1 },
  { name: "Raydium", symbol: "RAY", balance: 100, change24h: -1.4 },
];

const Dashboard = ({
  walletAddress,
  solBalance,
  usdEquivalent,
  loading,
}: {
  walletAddress: string;
  solBalance: number | null;
  usdEquivalent: number | null;
  loading: boolean;
}) => {
  const { connected, wallet } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      console.log("Wallet not connected. Redirecting to home...");
      router.replace("/");
    }
  }, [connected, router]);

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

  const displayUsdEquivalent = usdEquivalent !== null ? usdEquivalent : 0;

  if (!connected) return null;

  return (
    <div className="flex h-screen transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-black bg-opacity-80 z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            <p className="mt-4 text-lg text-gray-500">Loading data...</p>
          </div>
        )}
        {!loading && (
          <main className="flex-grow overflow-auto p-6 sm:p-8 md:p-10 lg:p-12 space-y-8">
            <GreetingSection
              walletAddress={walletAddress}
              solBalance={solBalance}
              usdEquivalent={displayUsdEquivalent}
            />
            <PortfolioSection tokens={tokens} />
          </main>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
