"use client";

import { useRouter } from "next/navigation";
import WalletInfoSection from "@/components/custom/client/section/WalletInfoSection";
import Sidebar from "@/components/custom/client/Sidebar";
import { useEffect, useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import PortfolioSection from "@/components/custom/client/section/PortfolioSection";
import { Loader2 } from "lucide-react";

const Portfolio = ({
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
  const { connected, publicKey, wallet } = useWallet();
  const router = useRouter();
  const [loadingInfo, setLoadingInfo] = useState(true);

  const redirectToHome = useCallback(() => {
    router.replace("/");
  }, [router]);

  useEffect(() => {
    if (!connected) redirectToHome();
  }, [connected, redirectToHome]);

  useEffect(() => {
    if (!wallet || !wallet.adapter) return;

    const handleDisconnect = () => {
      console.log("Wallet disconnected. Redirecting to home...");
      redirectToHome();
    };

    wallet.adapter.on("disconnect", handleDisconnect);

    return () => {
      wallet.adapter.off("disconnect", handleDisconnect);
    };
  }, [wallet, redirectToHome]);

  useEffect(() => {
    if (connected && publicKey) {
      setLoadingInfo(true);
      setTimeout(() => setLoadingInfo(false), 500);
    }
  }, [connected, publicKey]);

  if (!connected) return null;

  return (
    <div className="h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-6 sm:p-8 md:p-10 lg:p-12 space-y-8">
          {loadingInfo ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
              <p className="ml-4 text-xl text-gray-500">Loading wallet info...</p>
            </div>
          ) : (
            <WalletInfoSection
              walletAddress={walletAddress}
              solBalance={solBalance}
              usdEquivalent={usdEquivalent ?? 0}
            />
          )}

          {publicKey && <PortfolioSection publicKey={publicKey.toString()} />}
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
