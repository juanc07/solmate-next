"use client";

import { useState } from "react";
import Image from "next/image";

const SOL_ICON_URL = "/images/token/solana-token_128.png"; // Static URL for SOL icon

const GreetingSection = ({ 
  walletAddress, 
  solBalance, 
  usdEquivalent 
}: { 
  walletAddress: string; 
  solBalance: number | null; 
  usdEquivalent: number | null; 
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div
      className="p-4 sm:p-6 rounded-lg shadow-md 
                 bg-gradient-to-r from-violet-600 to-violet-900 
                 text-white dark:from-violet-700 dark:to-violet-950
                 max-w-md w-full mx-auto space-y-4"
    >
      {/* Greeting Header */}
      <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
        Welcome back, adventurer!
      </h2>

      {/* Wallet Address Section */}
      <div className="p-2 bg-violet-700 bg-opacity-30 rounded-md flex items-center justify-between text-xs sm:text-sm">
        <span className="truncate font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
        <button
          onClick={handleCopy}
          className="ml-2 text-xs px-2 py-1 bg-violet-500 hover:bg-violet-400 text-white rounded"
        >
          {copySuccess ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Balance and USD Equivalent */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center space-x-1">
          <Image src={SOL_ICON_URL} alt="Solana logo" width={16} height={16} className="rounded-full" />
          <p className="text-sm font-semibold">
            {solBalance !== null ? `${solBalance.toFixed(2)} SOL` : "Loading..."}
          </p>
        </div>
        <div className="text-right">          
          <p className="text-sm font-semibold">
            {usdEquivalent !== null ? `$${usdEquivalent.toFixed(2)}` : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GreetingSection;
