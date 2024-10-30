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

// Fetch token data with caching and AbortController support
const fetchTokenDataWithCache = async (
  mint: string,
  signal: AbortSignal
): Promise<Token | null> => {
  const cachedToken = localStorage.getItem(mint);
  if (cachedToken) {
    console.log(`Using cached data for ${mint}`);
    return JSON.parse(cachedToken);
  }

  try {
    const response = await fetch(`/api/token/${mint}`, { signal });
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
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Token fetch aborted");
    } else {
      console.error(`Error fetching data for mint ${mint}:`, error);
    }
    return null;
  }
};

// Fetch tokens sequentially with loading progress
const fetchTokens = async (
  publicKey: string,
  signal: AbortSignal,
  setFetchedCount: (count: number) => void
): Promise<Token[]> => {
  try {
    const response = await fetch(`/api/solana-data?publicKey=${publicKey}`, { signal });
    if (!response.ok) throw new Error("Failed to fetch token accounts");

    const { tokens: tokenAccounts } = await response.json();
    const tokens: Token[] = [];

    for (const [index, { mint, balance }] of tokenAccounts.entries()) {
      if (balance < 0.1) {
        console.log(`Skipping token ${mint} with balance ${balance}`);
        continue;
      }

      const tokenData = await fetchTokenDataWithCache(mint, signal);
      if (tokenData) {
        const usdValue = await SolanaPriceHelper.convertTokenToUSDC(
          tokenData.symbol,
          balance
        );

        tokens.push({ ...tokenData, balance, usdValue });
      }

      // Update the fetched count to reflect progress
      setFetchedCount(index + 1);

      if (signal.aborted) {
        console.log("Fetch operation aborted mid-process");
        break;
      }
    }

    return tokens.sort((a, b) => b.usdValue - a.usdValue);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Token fetching aborted");
    } else {
      console.error("Failed to fetch tokens:", error);
    }
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
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [fetchedCount, setFetchedCount] = useState(0); // Track fetched token count
  const [totalTokens, setTotalTokens] = useState(0); // Total number of tokens to fetch

  const redirectToHome = useCallback(() => {
    router.replace("/");
  }, [router]);

  // Redirect to home if wallet is not connected
  useEffect(() => {
    if (!connected) redirectToHome();
  }, [connected, redirectToHome]);

  // Handle wallet disconnect
  useEffect(() => {
    if (!wallet || !wallet.adapter) return; // Ensure wallet and adapter exist
  
    const { adapter } = wallet; // Destructure for cleaner code
  
    const handleDisconnect = () => {
      console.log("Wallet disconnected. Redirecting to home...");
      redirectToHome();
    };
  
    adapter.on("disconnect", handleDisconnect); // Attach listener
  
    return () => {
      adapter.off("disconnect", handleDisconnect); // Cleanup listener on unmount
    };
  }, [wallet, redirectToHome]);
  

  // Handle sidebar collapse on window resize
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch wallet info (solBalance and usdEquivalent)
  useEffect(() => {
    if (connected && publicKey) {
      setLoadingInfo(true);
      setTimeout(() => setLoadingInfo(false), 500);
    }
  }, [connected, publicKey]);

  // Fetch tokens with AbortController and loading progress
  useEffect(() => {
    if (connected && publicKey) {
      const controller = new AbortController();
      const { signal } = controller;

      setLoadingTokens(true);
      setFetchedCount(0); // Reset progress

      fetchTokens(publicKey.toString(), signal, setFetchedCount)
        .then((fetchedTokens) => {
          setTokens(fetchedTokens);
          setTotalTokens(fetchedTokens.length);
        })
        .finally(() => setLoadingTokens(false));

      return () => controller.abort();
    }
  }, [connected, publicKey]);

  if (!connected) return null;

  return (
    <div className="h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      <aside
        className={`flex-shrink-0 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-60"
        } bg-gray-800 dark:bg-gray-900`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-6 sm:p-8 md:p-10 lg:p-12 space-y-8">
          {loadingInfo ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
              <p className="ml-4 text-xl text-gray-500">Loading wallet info...</p>
            </div>
          ) : (
            <WalletInfoSection
              walletAddress={walletAddress}
              solBalance={solBalance}
              usdEquivalent={usdEquivalent ?? 0}
            />
          )}

          {loadingTokens ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
              <p className="ml-4 text-xl text-gray-500">
                Loading tokens... {fetchedCount}/{totalTokens}
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
