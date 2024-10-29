"use client";

import { useRouter } from "next/navigation";
import WalletInfoSection from "@/components/custom/client/section/WalletInfoSection";
import Sidebar from "@/components/custom/client/Sidebar";
import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { obfuscatePublicKey, sanitizeImageUrl } from "@/lib/helper";
import Image from "next/image";
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";

interface Token {
  mint: string;
  balance: number;
  icon: string;
  name: string;
  symbol: string;
  usdValue: number;
}

// Utility: Throttling with a delay between API requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility: Format large numbers into 'M' (Million) or 'B' (Billion)
const formatLargeNumber = (num: number | string): string => {
  const parsedNum = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(parsedNum) || parsedNum < 0) {
    return '0.00'; // Handle non-numeric or negative cases
  }

  if (parsedNum >= 1_000_000_000_000_000_000) {
    return `${(parsedNum / 1_000_000_000_000_000_000).toFixed(1)}Q`; // Quintillion
  } else if (parsedNum >= 1_000_000_000_000) {
    return `${(parsedNum / 1_000_000_000_000).toFixed(1)}T`; // Trillion
  } else if (parsedNum >= 1_000_000_000) {
    return `${(parsedNum / 1_000_000_000).toFixed(1)}B`; // Billion
  } else if (parsedNum >= 1_000_000) {
    return `${(parsedNum / 1_000_000).toFixed(1)}M`; // Million
  } else if (parsedNum >= 1_000) {
    return `${(parsedNum / 1_000).toFixed(1)}K`; // Thousand
  }

  return parsedNum.toFixed(2); // Default formatting for smaller numbers
};

// Caching: Fetch token data with caching logic
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
      usdValue: 0, // Will be updated later
    };

    localStorage.setItem(mint, JSON.stringify(token));
    return token;
  } catch (error) {
    console.error(`Error fetching data for mint ${mint}:`, error);
    return null;
  }
};

const fetchTokens = async (
  connection: Connection,
  publicKey: PublicKey
): Promise<Token[]> => {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
    );

    const tokens: Token[] = [];

    for (const { account } of tokenAccounts.value) {
      const info = account.data.parsed.info;
      const mintAddress = info.mint;
      const tokenBalance = info.tokenAmount.uiAmount || 0;

      if (tokenBalance < 0.1) {
        console.log(`Skipping token ${mintAddress} with balance ${tokenBalance}`);
        continue;
      }

      await delay(5000); // Introduce delay to avoid rate limits
      const tokenData = await fetchTokenDataWithCache(mintAddress);

      if (tokenData) {
        const usdValue = await SolanaPriceHelper.convertTokenToUSDC(
          tokenData.symbol,
          tokenBalance
        );

        tokens.push({
          ...tokenData,
          balance: tokenBalance,
          usdValue,
        });
      }
    }

    // Sort tokens by USD value in descending order
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
}: {
  walletAddress: string;
  solBalance: number | null;
  usdEquivalent: number | null;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { connected, publicKey, wallet } = useWallet();
  const router = useRouter();
  const [tokens, setTokens] = useState<Token[]>([]);

  const redirectToHome = useCallback(() => {
    router.replace("/");
  }, [router]);

  useEffect(() => {
    if (!connected) {
      redirectToHome();
    }
  }, [connected, redirectToHome]);

  useEffect(() => {
    const handleDisconnect = () => {
      redirectToHome();
    };

    wallet?.adapter?.on("disconnect", handleDisconnect);
    return () => {
      wallet?.adapter?.off("disconnect", handleDisconnect);
    };
  }, [wallet, redirectToHome]);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const env = process.env.NEXT_PUBLIC_SOLANA_ENV || "devnet";
    setSolanaEnvironment(env as SolanaEnvironment);
    console.log(`Using Solana environment: ${env}`);
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection(getSolanaEndpoint());
      fetchTokens(connection, publicKey).then(setTokens);
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
          <WalletInfoSection
            walletAddress={walletAddress}
            solBalance={solBalance}
            usdEquivalent={usdEquivalent ?? 0}
          />
          <div className="space-y-4">
            {tokens.map((token) => (
              <div
                key={token.mint}
                className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md"
              >
                <div className="relative w-10 h-10 mr-4">
                  <Image
                    src={sanitizeImageUrl(token.icon)}
                    alt={token.name}
                    fill
                    sizes="(max-width: 768px) 50px, 100px"
                    className="rounded-full object-cover"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "/images/token/default-token.png";
                    }}
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {token.name} ({token.symbol})
                  </h3>
                  <p className="text-sm text-gray-500">
                  {formatLargeNumber(token.balance)} - ${token.usdValue?.toFixed(2) ?? '0.00'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
