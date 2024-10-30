"use client";

import { useRouter } from "next/navigation";
import WalletInfoSection from "@/components/custom/client/section/WalletInfoSection";
import Sidebar from "@/components/custom/client/Sidebar";
import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import TokenItem from "@/components/custom/client/TokenItem";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";

interface Token {
  mint: string;
  balance: number;
  icon: string;
  name: string;
  symbol: string;
  usdValue: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Keep fetchTokenDataWithCache logic intact
const fetchTokenDataWithCache = async (mint: string): Promise<Token | null> => {
  const cachedToken = localStorage.getItem(mint);
  if (cachedToken) {
    console.log(`Using cached data for ${mint}`);
    return JSON.parse(cachedToken);
  }

  try {
    const response = await fetch(`/api/token/${mint}`);
    if (!response.ok) throw new Error("Failed to fetch token data");
    const tokenData = await response.json();

    const token: Token = {
      mint: tokenData.address,
      balance: 0,
      icon: tokenData.logoURI,
      name: tokenData.name,
      symbol: tokenData.symbol,
      usdValue: 0,
    };

    localStorage.setItem(mint, JSON.stringify(token));
    return token;
  } catch (error) {
    console.error(`Error fetching data for mint ${mint}:`, error);
    return null;
  }
};

// Fetch tokens from /api/solana-data route
const fetchTokens = async (publicKey: string): Promise<Token[]> => {
  try {
    const response = await fetch(`/api/solana-data?publicKey=${publicKey}`);
    if (!response.ok) throw new Error("Failed to fetch token accounts");

    const { tokens: tokenAccounts } = await response.json();
    const tokens: Token[] = [];

    for (const { mint, balance } of tokenAccounts) {
      if (balance < 0.1) {
        console.log(`Skipping token ${mint} with balance ${balance}`);
        continue;
      }

      await delay(5000); // Simulate delay for fetching token data

      const tokenData = await fetchTokenDataWithCache(mint);
      if (tokenData) {
        const usdValue = await SolanaPriceHelper.convertTokenToUSDC(
          tokenData.symbol,
          balance
        );

        tokens.push({
          ...tokenData,
          balance,
          usdValue,
        });
      }
    }

    return tokens.sort((a, b) => b.usdValue - a.usdValue);
  } catch (error) {
    console.error("Failed to fetch tokens:", error);
    return [];
  }
};

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { connected, publicKey, wallet } = useWallet();
  const router = useRouter();
  const [tokens, setTokens] = useState<Token[]>([]);

  const redirectToHome = useCallback(() => {
    router.replace("/");
  }, [router]);

  // Redirect to home if wallet is not connected
  useEffect(() => {
    if (!connected) {
      redirectToHome();
    }
  }, [connected, redirectToHome]);

  // Handle wallet disconnect
  useEffect(() => {
    const adapter = wallet?.adapter;
    if (!adapter) return; // Guard clause to ensure adapter exists

    const handleDisconnect = () => redirectToHome();

    adapter.on("disconnect", handleDisconnect); // Attach listener
    return () => {
      adapter.off("disconnect", handleDisconnect); // Cleanup listener
    };
  }, [wallet, redirectToHome]);

  // Handle sidebar collapse on window resize
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch tokens when connected and publicKey is available
  useEffect(() => {
    if (connected && publicKey) {
      fetchTokens(publicKey.toString()).then(setTokens);
    }
  }, [connected, publicKey]);

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
            usdEquivalent={usdEquivalent ?? 0}
          />
          <div className="space-y-4">
            {tokens.map((token) => (
              <TokenItem
                key={token.mint}
                icon={token.icon}
                name={token.name}
                symbol={token.symbol}
                balance={token.balance}
                usdValue={token.usdValue}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
