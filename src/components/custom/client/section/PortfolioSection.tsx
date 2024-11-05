"use client";

import { useEffect, useState } from "react";
import TokenItem from "@/components/custom/client/TokenItem";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper"; // Ensure this is used
import { openDB, IDBPDatabase } from "idb";
import { ITokenAccount } from "@/lib/interfaces/tokenAccount"; // Import the correct interface for Helius response

interface Token {
  mint: string;
  balance: number;
  icon: string; // URL for the token image
  name: string;
  symbol: string;
  usdValue: number;
  decimals: number;
}

const DB_NAME = "TokenCache";
const STORE_NAME = "tokens";

// Utility function to add delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize IndexedDB
const initDB = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "mint" });
      }
    },
  });
};

const normalizeAmount = (amount: number, decimals: number): number => {
  return amount / Math.pow(10, decimals);
};

// Get cached token data from IndexedDB (including image URL)
const getCachedToken = async (mint: string): Promise<Token | null> => {
  const db = await initDB();
  const cachedToken = await db.get(STORE_NAME, mint);
  return cachedToken;
};

// Store token data in IndexedDB (including image URL)
const cacheToken = async (token: Token): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, token);
};

const fetchTokenDataWithCache = async (
  mint: string,
  signal: AbortSignal
): Promise<Token | null> => {
  const cachedToken = await getCachedToken(mint);
  if (cachedToken) {
    return cachedToken;
  }

  try {
    const response = await fetch(`/api/token/${mint}`, { signal });
    if (!response.ok) throw new Error("Failed to fetch token data");

    const tokenData = await response.json();

    // Directly use the image URL from the response
    const token: Token = {
      mint: tokenData.address,
      balance: 0,
      icon: tokenData.logoURI,
      name: tokenData.name,
      symbol: tokenData.symbol,
      usdValue: 0,
      decimals: tokenData.decimals,
    };

    await cacheToken(token); // Cache the token data including the icon
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

    const { tokensFromAccountHelius }: { tokensFromAccountHelius: ITokenAccount[] } = await response.json();
    const totalTokens = tokensFromAccountHelius.length;
    const tokens: Token[] = [];

    for (const [index, { mint, amount }] of tokensFromAccountHelius.entries()) {
      const tokenData = await fetchTokenDataWithCache(mint, signal);
      if (tokenData) {
        const normalizedAmount = normalizeAmount(amount, tokenData.decimals);
        const usdValue = await SolanaPriceHelper.convertTokenToUSDC(tokenData.symbol, normalizedAmount);
        tokens.push({ ...tokenData, balance: normalizedAmount, usdValue });
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
