"use client";

import { useState } from "react";

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
      className="p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl shadow-xl 
                 bg-gradient-to-r from-violet-600 to-violet-900 
                 text-white dark:from-violet-700 dark:to-violet-950
                 max-w-lg w-full mx-auto space-y-6"
    >
      {/* Greeting Header */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">
        Welcome back, adventurer!
      </h2>

      {/* Wallet Address Section */}
      <div className="p-4 bg-violet-700 bg-opacity-30 rounded-lg flex items-center justify-between text-xs sm:text-sm md:text-base">
        <span className="truncate font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
        <button
          onClick={handleCopy}
          className="ml-3 text-xs sm:text-sm px-2 py-1 bg-violet-500 hover:bg-violet-400 text-white rounded-md"
        >
          {copySuccess ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Balance and USD Equivalent */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-left">          
          <p className="text-xl font-bold">
          SOL: {solBalance !== null ? `${solBalance.toFixed(2)} SOL` : "Loading..."}
          </p>
        </div>
        <div className="text-right">          
          <p className="text-xl font-bold">
            {usdEquivalent !== null ? `$${usdEquivalent.toFixed(2)}` : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GreetingSection;
