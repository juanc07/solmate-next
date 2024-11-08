"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletConnectOnlyButton } from "./WalletConnectOnlyButton";

interface Token {
  created_at?: string;
  symbol?: string;
  name?: string;
  address?: string;
  logoURI?: string;
  decimals?: number;
  daily_volume?: number;
  freeze_authority?: string;
  permanent_delegate?: string;
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
  const [showModal, setShowModal] = useState<'input' | 'output' | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!connected) return;

    const fetchTokens = async () => {
      try {
        const response = await fetch('https://api.jup.ag/tokens/v1', { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch tokens");
        const data = await response.json();
        console.log("data: ", data);

        if (Array.isArray(data)) {
          const validTokens = data.filter((token: Token) => token.address && token.symbol);
          setTokens(validTokens);
          setFilteredTokens(validTokens);  // Set initial filtered tokens to full list
        }
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        setTokens([]);
        setFilteredTokens([]);
      }
    };
    fetchTokens();
  }, [connected]);

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
  };

  const closeModal = () => setShowModal(null);

  // Close modal on click outside
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
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-black transition-colors duration-300 px-4 py-8 md:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-4 md:mb-6">
        Swap Tokens
      </h1>

      <div className="w-full max-w-lg p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        
        {/* Input Token Selection */}
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">From</label>
        <button
          onClick={() => openModal('input')}
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-left"
        >
          {inputToken ? `${inputToken.name} (${inputToken.symbol})` : "Select token"}
        </button>

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
        <button
          onClick={() => openModal('output')}
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-left"
        >
          {outputToken ? `${outputToken.name} (${outputToken.symbol})` : "Select token"}
        </button>

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

      {/* Modal for Token Selection */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            {/* Static Search Input */}
            <input
              type="text"
              placeholder="Search token"
              className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            />
            {/* Token List */}
            <div className="overflow-y-auto max-h-60">
              <ul className="space-y-2">
                {tokens.map((token) => (
                  <li
                    key={token.address}
                    onClick={() => {
                      if (showModal === 'input') setInputToken(token);
                      else setOutputToken(token);
                      closeModal();
                    }}
                    className="p-2 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <span>{token.name} ({token.symbol})</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Close Button */}
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
