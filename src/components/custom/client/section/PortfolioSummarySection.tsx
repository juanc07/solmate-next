"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import Image from "next/image";
import { openDB, IDBPDatabase } from "idb";
import { formatLargeNumber } from "@/lib/helper";
import { Loader2 } from "lucide-react";

interface Token {
  mint: string;
  balance: number;
  icon: string;
  name: string;
  symbol: string;
  usdValue: number;
  decimals: number;
}

const DB_NAME = "TokenSummaryCache";
const STORE_NAME = "tokens";
const defaultImage = "/images/token/default-token.png"; // Path to default image

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

// Store token data in IndexedDB (including image URL)
const cacheToken = async (token: Token): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, token);
};

const normalizeAmount = (amount: number, decimals: number): number => {
  return amount / Math.pow(10, decimals);
};

const fetchTokenDataWithCache = async (
  mint: string,
  signal: AbortSignal
): Promise<Token | null> => {
  const cachedToken = await getCachedToken(mint);

  if (cachedToken && cachedToken.icon && cachedToken.icon.trim()) {
    return cachedToken;
  }

  try {
    const response = await fetch(`/api/token/${mint}`, { signal });
    
    if (!response.ok){
      console.log("Failed to fetch token data");
      return null;
    }

    const tokenData = await response.json();

    const token: Token = {
      mint: tokenData.address,
      balance: 0,
      icon: tokenData.logoURI,
      name: tokenData.name,
      symbol: tokenData.symbol,
      usdValue: 0,
      decimals: tokenData.decimals,
    };

    await cacheToken(token);
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

    const { tokensFromAccountHelius } = await response.json();
    const totalTokens = tokensFromAccountHelius.length;
    const tokens: Token[] = [];

    for (const [index, { mint, amount }] of tokensFromAccountHelius.entries()) {
      const tokenData = await fetchTokenDataWithCache(mint, signal);
      if (tokenData) {
        const normalizedAmount = normalizeAmount(amount, tokenData.decimals);
        const { tokenAccountValue, tokenPrice } = await SolanaPriceHelper.convertTokenToUSDC(tokenData.symbol, mint, normalizedAmount);
        tokens.push({ ...tokenData, balance: normalizedAmount, usdValue: tokenAccountValue });
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

const getProxyUrl = async (imageUrl: string, type: string): Promise<string> => {
  try {
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}&type=${encodeURIComponent(type)}`;
    const response = await fetch(proxyUrl, { method: 'HEAD' });
    const isValidImage = response.ok && response.headers.get("Content-Type")?.startsWith("image/");
    return isValidImage ? proxyUrl : defaultImage;
  } catch {
    return defaultImage;
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

      const fetchedTokens = await fetchTokens(publicKey.toString(), signal, setProgress);

      // Fetch image URLs for tokens asynchronously
      const tokensWithIcons = await Promise.all(
        fetchedTokens.slice(0, 10).map(async (token) => ({
          ...token,
          icon: await getProxyUrl(token.icon, "token")
        }))
      );

      if (!signal.aborted) {
        setTokens(tokensWithIcons);
      }

      if (!signal.aborted) setLoading(false);
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
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="animate-spin text-violet-600 w-12 h-12" />
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
                <Image
                  src={token.icon || defaultImage}
                  alt={`${token.name} logo`}
                  layout="responsive"
                  width={32}
                  height={32}
                  className="rounded-full w-full max-w-[32px] h-auto sm:max-w-[48px]"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {token.name} ({token.symbol})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-gray-800 dark:text-gray-300">
                  <span className="font-medium">
                    {formatLargeNumber(token.balance)} {token.symbol}
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
