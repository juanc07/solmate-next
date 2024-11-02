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
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 md:space-x-6">
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-medium">SOL Balance</h3>
          <p className="text-xl font-bold mt-1">
            {solBalance !== null ? `${solBalance} SOL` : "Loading..."}
          </p>
        </div>
        <div className="w-px h-6 bg-gray-400 dark:bg-gray-600 hidden md:block" /> {/* Divider */}
        <div className="flex flex-col items-center md:items-end">
          <h3 className="text-lg font-medium">USD Equivalent</h3>
          <p className="text-xl font-bold mt-1">
            {usdEquivalent !== null ? `$${usdEquivalent.toFixed(2)} USD` : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GreetingSection;
