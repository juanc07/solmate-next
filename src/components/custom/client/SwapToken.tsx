"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletConnectOnlyButton } from "./WalletConnectOnlyButton";

interface Token {
  created_at?:string;
  symbol?: string;
  name?: string;
  address?: string;
  logoURI?:string;
  decimals?:number;
  daily_volume?:number;
  freeze_authority?:string;
  permanent_delegate?:string;
  extensions?: {
    isVerified?: boolean;
  };
}



const SwapToken: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [inputToken, setInputToken] = useState<Token | null>(null);
  const [outputToken, setOutputToken] = useState<Token | null>(null);
  const [inputAmount, setInputAmount] = useState<string>('');
  const [outputAmount, setOutputAmount] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!connected) return; // Only fetch tokens if wallet is connected

    const fetchTokens = async () => {
      console.log("Wallet connected. Fetching tokens...");
      try {
        const response = await fetch('https://api.jup.ag/tokens/v1', { cache: "no-store" });
        
        if (!response.ok) {
          throw new Error("Failed to fetch tokens");
        }
        const data = await response.json();
        console.log("Fetched token data:", data); // Log the raw token data

        if (Array.isArray(data)) {
          const validTokens = data.filter((token: Token) => token.address && token.symbol);
          setTokens(validTokens);
          setFilteredTokens(validTokens); // Set filteredTokens initially
          console.log("Tokens set:", validTokens); // Log valid tokens
        } else {
          console.error("Unexpected token data format:", data);
          setTokens([]);
          setFilteredTokens([]);
        }
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        setTokens([]);
        setFilteredTokens([]);
      }
    };
    fetchTokens();
  }, [connected]);

  // Temporary test: Directly set filteredTokens to tokens without filtering
  useEffect(() => {
    console.log("Applying filter...");
    console.log("Original tokens:", tokens); // Log tokens to confirm data structure
    setFilteredTokens(tokens); // Temporarily set filteredTokens to tokens directly
  }, [tokens]);

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

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-black transition-colors duration-300 px-4 py-8 md:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-4 md:mb-6">
        Swap Tokens
      </h1>

      <div className="w-full max-w-lg p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        
        {/* Search Field */}
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Search Token</label>
        <input
          type="text"
          placeholder="Search by name or symbol"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
        />

        {/* Input Token Selection */}
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">From</label>
        <select
          value={inputToken?.address || ''}
          onChange={(e) => setInputToken(filteredTokens.find(t => t.address === e.target.value) || null)}
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
        >
          <option value="">Select token</option>
          {filteredTokens.slice(0, 100).map(token => (
            <option key={`${token.symbol}-${token.address}`} value={token.address}>
              {token.name} ({token.symbol})
            </option>
          ))}
        </select>

        {/* Input Amount */}
        <input
          type="number"
          placeholder="Enter amount"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
        />

        {/* Output Token Selection */}
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">To</label>
        <select
          value={outputToken?.address || ''}
          onChange={(e) => setOutputToken(filteredTokens.find(t => t.address === e.target.value) || null)}
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
        >
          <option value="">Select token</option>
          {filteredTokens.slice(0, 100).map(token => (
            <option key={`${token.symbol}-${token.address}`} value={token.address}>
              {token.name} ({token.symbol})
            </option>
          ))}
        </select>

        {/* Output Amount */}
        <input
          type="text"
          placeholder="Estimated amount"
          value={outputAmount}
          readOnly
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
        />

        {/* Connect Wallet / Swap Button */}
        {connected ? (
          <button
            onClick={handleSwap}
            disabled={loading || !inputToken || !outputToken || !inputAmount}
            className="w-full py-2 px-4 bg-violet-600 dark:bg-violet-500 text-white font-semibold rounded hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors duration-200"
          >
            {loading ? "Swapping..." : "Swap"}
          </button>
        ) : (
          <div className="w-full flex">
            <WalletConnectOnlyButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapToken;
