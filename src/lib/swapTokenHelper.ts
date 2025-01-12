import { openDB, IDBPDatabase } from "idb";
import { ITokenAccount } from "@/lib/interfaces/tokenAccount";
import { IToken } from "@/lib/interfaces/token";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import { normalizeAmount } from "@/lib/helper";
import { PublicKey } from '@solana/web3.js';

const DB_NAME = "SwapTokenCache";
const STORE_NAME = "swapTokens";
const API_CALL_DELAY = 3000; // 4000ms delay between API calls to avoid rate limiting
const inProgressMints = new Set<string>(); // Track mints currently being processed

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

// Retrieve cached token from IndexedDB
const getCachedToken = async (mint: string): Promise<IToken | null> => {
  const db = await initDB();
  return db.get(STORE_NAME, mint);
};

// Cache token in IndexedDB
const cacheToken = async (token: IToken): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, token);
};

// Utility function to delay execution
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Fetch token data with caching logic
export const fetchTokenDataWithCache = async (mint: string): Promise<IToken | null> => {
  if (inProgressMints.has(mint)) {
    console.warn(`Already processing mint ${mint}. Skipping duplicate call.`);
    return null; // Skip processing if already in progress
  }

  const cachedToken = await getCachedToken(mint);
  if (cachedToken && cachedToken.icon && cachedToken.icon.trim()) return cachedToken;

  inProgressMints.add(mint); // Mark this mint as in progress

  try {
    const response = await fetch(`/api/token/${mint}`);

    if (!response.ok) {
      console.log(`Failed to fetch token data for mint ${mint}`);
      return null;
    }

    const tokenData = await response.json();
    const token: IToken = {
      mint: tokenData.address,
      balance: 0,
      icon: tokenData.logoURI,
      name: tokenData.name,
      symbol: tokenData.symbol,
      usdValue: 0,
      decimals: tokenData.decimals,
      price: 0
    };

    await cacheToken(token);
    return token;
  } catch (error) {
    console.error(`Error fetching data for mint ${mint}:`, error);
    return null;
  } finally {
    inProgressMints.delete(mint); // Remove mint from in-progress after completion
  }
};

// Fetch tokens for a given account with progress tracking
export const fetchAccountTokens = async (
  publicKey: PublicKey | null,
  setProgress: (progress: number) => void
): Promise<IToken[]> => {
  try {
    const response = await fetch(`/api/solana-data?publicKey=${publicKey}`);
    if (!response.ok) throw new Error("Failed to fetch token accounts");

    const { tokensFromAccountHelius }: { tokensFromAccountHelius: ITokenAccount[] } = await response.json();
    if (!tokensFromAccountHelius || tokensFromAccountHelius.length === 0) {
      console.warn("No tokens found for the given public key.");
      setProgress(100); // Ensure progress is marked as complete
      return [];
    }

    const totalTokens = tokensFromAccountHelius.length;
    const accountTokens: IToken[] = [];

    const chunkSize = 10;
    let completed = 0;

    for (let i = 0; i < tokensFromAccountHelius.length; i += chunkSize) {
      const chunk = tokensFromAccountHelius.slice(i, i + chunkSize);

      for (const { mint, amount } of chunk) {
        try {
          const tokenData = await fetchTokenDataWithCache(mint);
          if (tokenData) {
            const normalizedAmount = normalizeAmount(amount, tokenData.decimals);
            const { tokenAccountValue, tokenPrice } = await SolanaPriceHelper.convertTokenToUSDC(tokenData.symbol, mint, normalizedAmount);
            accountTokens.push({ ...tokenData, balance: normalizedAmount, usdValue: tokenAccountValue, price: tokenPrice });
          }
          await delay(API_CALL_DELAY); // Delay between API calls
        } catch (error) {
          console.error(`Error processing mint ${mint}:`, error);
        }
      }

      completed += chunk.length;
      setProgress(Math.round((completed / totalTokens) * 100));
    }

    setProgress(100); // Ensure progress reaches 100%
    return accountTokens.sort((a, b) => b.usdValue - a.usdValue);
  } catch (error) {
    console.error("Failed to fetch tokens:", error);
    setProgress(100); // Mark progress complete even on failure
    return [];
  }
};
