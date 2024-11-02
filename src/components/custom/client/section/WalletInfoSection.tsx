"use client";

import { useState } from "react";
import TokenItem from "@/components/custom/client/TokenItem";

const SOL_ICON_URL = "/images/token/solana-token_128.png"; // Static URL for SOL icon

const WalletInfoSection = ({ 
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
    <div className="max-w-md w-full mx-auto space-y-6">
      
      {/* Wallet Address Card */}
      <div
        className="relative p-4 flex items-center justify-between rounded-lg shadow-lg bg-gradient-to-r from-violet-600 to-violet-900 
                   text-white dark:from-violet-700 dark:to-violet-950"
      >
        {/* "Connected as" Label */}
        <span className="absolute top-1 left-2 text-[10px] text-gray-400 dark:text-gray-500">
          Connected as
        </span>
        
        <div className="flex-1 truncate text-center font-mono text-sm sm:text-base md:text-lg">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
        
        <button
          onClick={handleCopy}
          className="ml-4 text-xs sm:text-sm bg-violet-500 hover:bg-violet-400 text-white px-2 py-1 rounded-md"
        >
          {copySuccess ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* SOL Balance using TokenItem */}
      <TokenItem
        icon={SOL_ICON_URL} // SOL icon URL
        name="Solana"
        symbol="SOL"
        balance={solBalance ?? 0} // Default to 0 if balance is null
        usdValue={usdEquivalent ?? 0} // Default to 0 if USD value is null
        sanitize={false} // Disables sanitization for local image paths
      />

    </div>
  );
};

export default WalletInfoSection;
