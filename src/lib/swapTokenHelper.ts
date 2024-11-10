import { openDB, IDBPDatabase } from "idb";
import { ITokenAccount } from "@/lib/interfaces/tokenAccount";
import { IToken } from "@/lib/interfaces/token";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import { normalizeAmount } from "@/lib/helper";
import { PublicKey } from '@solana/web3.js';


const DB_NAME = "SwapTokenCache";
const STORE_NAME = "swapTokens";

const initDB = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "mint" });
      }
    },
  });
};

const getCachedToken = async (mint: string): Promise<IToken | null> => {
  const db = await initDB();
  return db.get(STORE_NAME, mint);
};

const cacheToken = async (token: IToken): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, token);
};

export const fetchTokenDataWithCache = async (mint: string): Promise<IToken | null> => {
  const cachedToken = await getCachedToken(mint);
  if (cachedToken && cachedToken.icon && cachedToken.icon.trim()) return cachedToken;

  try {
    const response = await fetch(`/api/token/${mint}`);
    if (!response.ok) throw new Error("Failed to fetch token data");

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
  }
};

export const fetchAccountTokens = async (
  publicKey: PublicKey | null,
  setProgress: (progress: number) => void
): Promise<IToken[]> => {
  try {
    const response = await fetch(`/api/solana-data?publicKey=${publicKey}`);
    if (!response.ok) throw new Error("Failed to fetch token accounts");

    const { tokensFromAccountHelius }: { tokensFromAccountHelius: ITokenAccount[] } = await response.json();
    const totalTokens = tokensFromAccountHelius.length;
    const accountTokens: IToken[] = [];

    const chunkSize = 10;
    let completed = 0;

    for (let i = 0; i < tokensFromAccountHelius.length; i += chunkSize) {
      const chunk = tokensFromAccountHelius.slice(i, i + chunkSize);
      const chunkPromises = chunk.map(async ({ mint, amount }) => {
        const tokenData = await fetchTokenDataWithCache(mint);
        if (tokenData) {
          const normalizedAmount = normalizeAmount(amount, tokenData.decimals);
          const { tokenAccountValue, tokenPrice } = await SolanaPriceHelper.convertTokenToUSDC(tokenData.symbol, mint, normalizedAmount);
          accountTokens.push({ ...tokenData, balance: normalizedAmount, usdValue: tokenAccountValue, price: tokenPrice });
        }
      });
      await Promise.all(chunkPromises);

      completed += chunk.length;
      setProgress(Math.round((completed / totalTokens) * 100));
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    return accountTokens.sort((a, b) => b.usdValue - a.usdValue);
  } catch (error) {
    console.error("Failed to fetch tokens:", error);
    return [];
  }
};