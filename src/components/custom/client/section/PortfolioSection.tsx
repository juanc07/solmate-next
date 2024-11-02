"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"; // ShadCN UI Card
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import Image from "next/image";

interface Token {
  mint: string;
  balance: number;
  icon: string;
  name: string;
  symbol: string;
  usdValue: number;
}

const fetchTokenDataWithCache = async (
  mint: string,
  signal: AbortSignal
): Promise<Token | null> => {
  const cachedToken = localStorage.getItem(mint);
  if (cachedToken) return JSON.parse(cachedToken);

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
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Token fetch aborted");
    } else {
      console.error(`Error fetching data for mint ${mint}:`, error);
    }
    return null;
  }
};

const PortfolioSection = () => {
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tokens, sort by usdValue, and exclude SOL
  useEffect(() => {
    if (!publicKey) return;

    const fetchTopTokens = async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        setLoading(true);
        const response = await fetch(`/api/solana-data?publicKey=${publicKey.toString()}`, { signal });
        if (!response.ok) throw new Error("Failed to fetch token accounts");

        const { tokens: tokenAccounts } = await response.json();
        const allTokens: Token[] = [];

        for (const { mint, balance } of tokenAccounts) {
          if (balance < 0.1 || mint === "So11111111111111111111111111111111111111112") continue; // Skip SOL

          const tokenData = await fetchTokenDataWithCache(mint, signal);
          if (tokenData) {
            const usdValue = await SolanaPriceHelper.convertTokenToUSDC(
              tokenData.symbol,
              balance
            );

            allTokens.push({ ...tokenData, balance, usdValue });
          }
        }

        // Sort by USD value, exclude SOL, and take top 10
        const topTokens = allTokens
          .sort((a, b) => b.usdValue - a.usdValue)
          .slice(0, 10);

        setTokens(topTokens);
      } catch (error) {
        console.error("Error fetching top tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTokens();
  }, [publicKey]);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-6 text-violet-600 dark:text-violet-400">
        Your Portfolio
      </h2>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-300">Loading tokens...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <Card
              key={token.symbol}
              className="hover:scale-105 transition-transform border border-violet-500 bg-white dark:bg-gray-800"
            >
              <CardHeader className="flex items-center space-x-3">
                {token.icon && (
                  <Image
                    src={token.icon}
                    alt={`${token.name} logo`}
                    width={32}
                    height={32}
                    className="rounded-full"
                    unoptimized
                  />
                )}
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {token.name} ({token.symbol})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-gray-800 dark:text-gray-300">
                  <span className="font-medium">
                    {token.balance.toFixed(2)} {token.symbol}
                  </span>
                  <span className="font-semibold">${token.usdValue.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioSection;
