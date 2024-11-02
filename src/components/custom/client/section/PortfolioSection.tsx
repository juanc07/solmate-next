"use client";

import { useEffect, useState } from "react";
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

const fetchTokenDataWithCache = async (
  mint: string,
  signal: AbortSignal
): Promise<Token | null> => {
  const cachedToken = localStorage.getItem(mint);
  if (cachedToken) {
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
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log(`Fetch aborted for mint: ${mint}`);
    } else {
      console.error(`Error fetching data for mint ${mint}:`, error);
    }
    return null;
  }
};

const fetchTokens = async (
  publicKey: string,
  signal: AbortSignal,
  setProgress: (progress: number) => void
): Promise<Token[]> => {
  try {
    const response = await fetch(`/api/solana-data?publicKey=${publicKey}`, { signal });
    if (!response.ok) throw new Error("Failed to fetch token accounts");

    const { tokens: tokenAccounts } = await response.json();
    const totalTokens = tokenAccounts.length;
    const tokens: Token[] = [];

    for (const [index, { mint, balance }] of tokenAccounts.entries()) {
      if (balance < 0.1) continue;

      const tokenData = await fetchTokenDataWithCache(mint, signal);
      if (tokenData) {
        const usdValue = await SolanaPriceHelper.convertTokenToUSDC(tokenData.symbol, balance);
        tokens.push({ ...tokenData, balance, usdValue });
      }

      setProgress(Math.round(((index + 1) / totalTokens) * 100));
      if (signal.aborted) break;
    }

    return tokens.sort((a, b) => b.usdValue - a.usdValue);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("Token fetching aborted");
    } else {
      console.error("Failed to fetch tokens:", error);
    }
    return [];
  }
};

const PortfolioSection = ({ publicKey }: { publicKey: string }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    setProgress(0);

    fetchTokens(publicKey, signal, setProgress)
      .then((fetchedTokens) => {
        if (!signal.aborted) setTokens(fetchedTokens);
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [publicKey]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-violet-600 dark:text-violet-400 mb-4 text-center">
        Your Tokens
      </h2>
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          <p className="mt-4 text-xl text-gray-500 text-center">
            Loading tokens... {progress}%
          </p>
        </div>
      ) : tokens.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
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
      ) : (
        <p className="text-center text-gray-500 mt-4">No tokens found.</p>
      )}
    </div>
  );
};

export default PortfolioSection;
