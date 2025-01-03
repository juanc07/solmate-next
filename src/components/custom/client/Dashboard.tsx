"use client";

import { useRouter } from "next/navigation";
import GreetingSection from "@/components/custom/client/section/GreetingSection";
import Sidebar from "@/components/custom/client/Sidebar";
import PortfolioSummarySection from "@/components/custom/client/section/PortfolioSummarySection";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react"; // ShadCN Loading Spinner

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
            <Loader2 className="animate-spin text-violet-600 w-16 h-16" />
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
            <PortfolioSummarySection />
          </main>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
