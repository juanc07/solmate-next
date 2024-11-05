"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import Image from "next/image";
import { sanitizeImageUrl } from "@/lib/helper";
import { openDB, IDBPDatabase } from "idb";

interface Token {
  mint: string;
  balance: number;
  icon: string;
  name: string;
  symbol: string;
  usdValue: number;
}

const DB_NAME = "TokenSummaryCache";
const STORE_NAME = "tokens";
const DEFAULT_ICON = "/images/token/default-token.png";

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

// Get cached token data from IndexedDB
const getCachedToken = async (mint: string): Promise<Token | null> => {
  const db = await initDB();
  return await db.get(STORE_NAME, mint);
};

// Store token data in IndexedDB
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
    let imageURL;

    try {
      const imageResponse = await fetch(tokenData.logoURI, { signal });
      if (!imageResponse.ok) throw new Error("Failed to fetch image");
      const imageBlob = await imageResponse.blob();
      imageURL = URL.createObjectURL(imageBlob);

      // Cache the token data with the fetched image
      const token: Token = {
        mint: tokenData.address,
        balance: 0,
        icon: imageURL,
        name: tokenData.name,
        symbol: tokenData.symbol,
        usdValue: 0,
      };

      await cacheToken(token);
      return token;

    } catch (imageError) {
      console.error(`Failed to fetch image for mint ${mint}:`, imageError);
      // Use default image but do not cache it
      return {
        mint: tokenData.address,
        balance: 0,
        icon: DEFAULT_ICON,
        name: tokenData.name,
        symbol: tokenData.symbol,
        usdValue: 0,
      };
    }
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
    if (error instanceof DOMException && error.name !== "AbortError") {
      console.error("Failed to fetch tokens:", error);
    }
    return [];
  }
};

const PortfolioSummarySection = () => {
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!publicKey) return;

    const controller = new AbortController();
    const { signal } = controller;

    const fetchTopTokens = async () => {
      setLoading(true);
      setProgress(0);

      fetchTokens(publicKey.toString(), signal, setProgress)
        .then((fetchedTokens) => {
          if (!signal.aborted) {
            setTokens(fetchedTokens.slice(0, 10)); // Take top 10 tokens by USD value
          }
        })
        .finally(() => {
          if (!signal.aborted) setLoading(false);
        });
    };

    fetchTopTokens();

    return () => {
      controller.abort();
      console.log("Aborting fetch on unmount");
    };
  }, [publicKey]);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-6 text-violet-600 dark:text-violet-400 text-center">
        Your Top 10 Tokens
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          <p className="mt-4 text-xl text-gray-500">Loading tokens... {progress}%</p>
        </div>
      ) : tokens.length > 0 ? (
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
      ) : (
        <p className="text-center text-gray-500">No tokens found.</p>
      )}
    </div>
  );
};

export default PortfolioSummarySection;
