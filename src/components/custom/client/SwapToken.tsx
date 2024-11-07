"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletConnectOnlyButton } from "./WalletConnectOnlyButton"; // Import your custom connect button

interface Token {
  symbol: string;
  mintAddress: string;
}

const SwapToken: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [inputToken, setInputToken] = useState<Token | null>(null);
  const [outputToken, setOutputToken] = useState<Token | null>(null);
  const [inputAmount, setInputAmount] = useState<string>('');
  const [outputAmount, setOutputAmount] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('https://price.jup.ag/v4/tokens');
        const data = await response.json();

        if (Array.isArray(data)) {
          setTokens(data);
        } else {
          console.error("Unexpected token data format:", data);
          setTokens([]);
        }
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        setTokens([]);
      }
    };
    fetchTokens();
  }, []);

  const handleSwap = async () => {
    if (!inputToken || !outputToken || !publicKey) return;

    setLoading(true);
    try {
      const response = await fetch('https://quote-api.jup.ag/v1/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputMint: inputToken.mintAddress,
          outputMint: outputToken.mintAddress,
          amount: parseFloat(inputAmount) * Math.pow(10, 6),
          slippage: 0.5,
          userPublicKey: publicKey.toString(),
        }),
      });

      const data = await response.json();
      if (data && data.outputAmount) {
        setOutputAmount((data.outputAmount / Math.pow(10, 6)).toString());
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
        {/* Input Token Selection */}
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">From</label>
        <select
          value={inputToken?.mintAddress || ''}
          onChange={(e) => setInputToken(tokens.find(t => t.mintAddress === e.target.value) || null)}
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
        >
          <option value="">Select token</option>
          {tokens.map(token => (
            <option key={token.mintAddress} value={token.mintAddress}>
              {token.symbol}
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
          value={outputToken?.mintAddress || ''}
          onChange={(e) => setOutputToken(tokens.find(t => t.mintAddress === e.target.value) || null)}
          className="w-full p-2 mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
        >
          <option value="">Select token</option>
          {tokens.map(token => (
            <option key={token.mintAddress} value={token.mintAddress}>
              {token.symbol}
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
