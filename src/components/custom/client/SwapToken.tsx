'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletConnectOnlyButton } from "./WalletConnectOnlyButton";
import Spinner from './Spinner';
import TokenSelection from './TokenSelection';
import { FaSearch } from 'react-icons/fa';
import { ITokenAccount } from "@/lib/interfaces/tokenAccount";
import { IToken } from "@/lib/interfaces/token";
import { IJupiterToken } from "@/lib/interfaces/jupiterToken";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import { openDB, IDBPDatabase } from "idb";
import { normalizeAmount } from "@/lib/helper";
import { PublicKey } from '@solana/web3.js';

const INITIAL_LOAD_COUNT = 200;

const DB_NAME = "SwapTokenCache";
const STORE_NAME = "swapTokens";

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

const getCachedToken = async (mint: string): Promise<IToken | null> => {
  const db = await initDB();
  return db.get(STORE_NAME, mint);
};

const cacheToken = async (token: IToken): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, token);
};

const fetchTokenDataWithCache = async (mint: string, signal: AbortSignal): Promise<IToken | null> => {
  const cachedToken = await getCachedToken(mint);
  if (cachedToken && cachedToken.icon && cachedToken.icon.trim()) return cachedToken;

  try {
    const response = await fetch(`/api/token/${mint}`, { signal });
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
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log(`Fetch aborted for mint: ${mint}`);
    } else {
      console.error(`Error fetching data for mint ${mint}:`, error);
    }
    return null;
  }
};

const fetchAccountTokens = async (
  publicKey: PublicKey | null,
  signal: AbortSignal,
  setProgress: (progress: number) => void
): Promise<IToken[]> => {
  try {
    const response = await fetch(`/api/solana-data?publicKey=${publicKey}`, { signal });
    if (!response.ok) throw new Error("Failed to fetch token accounts");

    const { tokensFromAccountHelius }: { tokensFromAccountHelius: ITokenAccount[] } = await response.json();
    const totalTokens = tokensFromAccountHelius.length;
    const accountTokens: IToken[] = [];

    const fetchPromises = tokensFromAccountHelius.map(async ({ mint, amount }, index) => {
      const tokenData = await fetchTokenDataWithCache(mint, signal);
      if (tokenData) {
        const normalizedAmount = normalizeAmount(amount, tokenData.decimals);
        const { tokenAccountValue, tokenPrice } = await SolanaPriceHelper.convertTokenToUSDC(tokenData.symbol, mint, normalizedAmount);
        accountTokens.push({ ...tokenData, balance: normalizedAmount, usdValue: tokenAccountValue, price: tokenPrice });
      }

      if (index % 10 === 0) {
        setProgress(Math.round(((index + 1) / totalTokens) * 100));
      }
    });

    await Promise.all(fetchPromises);
    return accountTokens.sort((a, b) => b.usdValue - a.usdValue);
  } catch (error) {
    console.error("Failed to fetch tokens:", error);
    return [];
  }
};


const SwapToken: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [accountTokens, setAccountTokens] = useState<IToken[]>([]);
  const [jupiterTokens, setJupiterTokens] = useState<IJupiterToken[]>([]);
  const [tokens, setTokens] = useState<IJupiterToken[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<IJupiterToken[]>([]);
  const [inputToken, setInputToken] = useState<IJupiterToken | null>(null);
  const [outputToken, setOutputToken] = useState<IJupiterToken | null>(null);
  const [inputAmount, setInputAmount] = useState<string>('');
  const [outputAmount, setOutputAmount] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState<'input' | 'output' | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [scrollToToken, setScrollToToken] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const tokenRefs = useRef<{ [key: string]: React.RefObject<HTMLLIElement> }>({});

  useEffect(() => {
    if (!connected) return;

    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    setProgress(0);

    const loadTokens = async () => {
      try {
        const [accountTokens, jupiterData] = await Promise.all([
          fetchAccountTokens(publicKey, signal, setProgress),
          fetch('https://api.jup.ag/tokens/v1', { cache: "no-store", signal }).then(res => res.json()),
        ]);

        const jupiterTokens = Array.isArray(jupiterData)
          ? jupiterData.filter((token: IJupiterToken) => token.address && token.symbol)
          : [];

        setJupiterTokens(jupiterTokens);

        const matchedAccountTokens = accountTokens.reduce<IJupiterToken[]>((result, accountToken) => {
          const match = jupiterTokens.find(jToken => jToken.address === accountToken.mint);
          if (match) {
            const tokenWithPrice = {
              ...match,
              price: accountToken.price,
              amount: accountToken.balance,
            };
            result.push(tokenWithPrice);
          }
          return result;
        }, []);

        const remainingJupiterTokens = jupiterTokens.filter(
          jToken => !matchedAccountTokens.some(accountToken => accountToken.address === jToken.address)
        );

        const combinedTokens = [...matchedAccountTokens, ...remainingJupiterTokens.slice(0, INITIAL_LOAD_COUNT)];

        setTokens(combinedTokens);
        setFilteredTokens(combinedTokens.slice(0, INITIAL_LOAD_COUNT));

      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        setTokens([]);
        setFilteredTokens([]);
      } finally {
        setLoading(false);
      }
    };

    loadTokens();

    return () => controller.abort();
  }, [connected]);

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredTokens(tokens.slice(0, INITIAL_LOAD_COUNT));
    } else {
      const matchedTokens = jupiterTokens.filter(token =>
        token.name.toLowerCase() === searchTerm.toLowerCase() ||
        token.symbol.toLowerCase() === searchTerm.toLowerCase() ||
        token.address.toLowerCase() === searchTerm.toLowerCase()
      );

      // Append the matched tokens to the current filteredTokens array without replacing it
      setFilteredTokens(prevFilteredTokens => {
        const newTokens = matchedTokens.filter(
          matchedToken => !prevFilteredTokens.some(token => token.address === matchedToken.address)
        );
        return [...prevFilteredTokens, ...newTokens];
      });

      // Scroll to the first match if available
      setScrollToToken(matchedTokens[0]?.address || null);
    }
  };


  useEffect(() => {
    if (scrollToToken && tokenRefs.current[scrollToToken]?.current) {
      tokenRefs.current[scrollToToken].current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setScrollToToken(null);
    }
  }, [filteredTokens, scrollToToken]);

  const handleSwap = async () => {
    if (!inputToken || !outputToken || !publicKey) return;

    setLoading(true);
    try {
      const inputMint = inputToken.address;
      const outputMint = outputToken.address;
      const amount = (parseFloat(inputAmount) * Math.pow(10, 6)).toFixed(0);
      const slippageBps = 50;

      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
      );
      const data = await response.json();

      if (data && data.quoteResponse) {
        setOutputAmount((data.quoteResponse.outputAmount / Math.pow(10, 6)).toString());
      } else {
        alert("Swap failed: Unable to fetch quote");
      }
    } catch (error) {
      console.error("Swap failed:", error);
      alert("An error occurred during the swap");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: 'input' | 'output') => {
    setShowModal(type);
    setSearchTerm('');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-black transition-colors duration-300 px-4 py-8 md:py-12 relative">
      <h1 className="text-3xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-4 md:mb-6">
        Swap Tokens
      </h1>

      <div className="w-full max-w-lg p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md relative z-10">
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">You're Selling</label>
        <button
          onClick={() => openModal('input')}
          disabled={!connected || loading}
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-left disabled:opacity-50"
        >
          {inputToken ? `${inputToken.name} (${inputToken.symbol})` : "Select token"}
        </button>

        <input
          type="number"
          placeholder="Enter amount"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
          disabled={!connected || loading}
        />

        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">You're Buying</label>
        <button
          onClick={() => openModal('output')}
          disabled={!connected || loading}
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-left disabled:opacity-50"
        >
          {outputToken ? `${outputToken.name} (${outputToken.symbol})` : "Select token"}
        </button>

        <input
          type="text"
          placeholder="Estimated amount"
          value={outputAmount}
          readOnly
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
        />

        {connected ? (
          <button
            onClick={handleSwap}
            disabled={loading || !inputToken || !outputToken || !inputAmount}
            className="w-full py-2 px-4 bg-violet-600 dark:bg-violet-500 text-white font-semibold rounded hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors duration-200 disabled:opacity-50"
          >
            Swap
          </button>
        ) : (
          <div className="w-full flex">
            <WalletConnectOnlyButton />
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-4">
            <Spinner />
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Token...</span>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-hidden">
          <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="relative flex items-center mb-4">
              <input
                type="text"
                placeholder="Search token"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 p-1 bg-violet-600 text-white rounded"
              >
                <FaSearch />
              </button>
            </div>
            <div className="overflow-y-auto max-h-60 scrollbar-hide">
              <ul className="space-y-2">
                {filteredTokens.map((token, index) => {
                  const ref = (tokenRefs.current[token.address] ||= React.createRef());
                  return (
                    <li key={`${token.address}-${index}`} ref={ref}>
                      <TokenSelection
                        name={token.name}
                        symbol={token.symbol}
                        logoURI={token.logoURI}
                        address={token.address}
                        price={token.price}
                        amount={token.amount}
                        isVerified={token.extensions?.isVerified}
                        freeze_authority={token.freeze_authority}
                        permanent_delegate={token.permanent_delegate}
                        onClick={() => {
                          if (showModal === 'input') setInputToken(token);
                          else setOutputToken(token);
                          closeModal();
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 w-full py-2 px-4 bg-red-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapToken;
