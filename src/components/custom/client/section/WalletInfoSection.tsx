"use client";

import { useState } from "react";
import Image from "next/image";

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
    <div className="relative max-w-md w-full mx-auto p-4 rounded-lg shadow-lg bg-gradient-to-r from-violet-600 to-violet-900 text-white dark:from-violet-700 dark:to-violet-950">
      {/* "Connected as" Label */}
      <span className="text-[10px] text-gray-400 dark:text-gray-500 absolute top-2 left-2">
        Connected as
      </span>

      {/* Wallet Address and Copy Button */}
      <div className="flex items-center justify-between mt-1">
        <div className="truncate font-mono text-sm sm:text-base md:text-lg">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
        <button
          onClick={handleCopy}
          className="ml-2 text-xs sm:text-sm bg-violet-500 hover:bg-violet-400 text-white px-2 py-1 rounded-md"
        >
          {copySuccess ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* SOL Balance and USD Equivalent */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          <Image src={SOL_ICON_URL} alt="Solana logo" width={20} height={20} className="rounded-full" />
          <p className="text-sm sm:text-base font-semibold">
            {solBalance !== null ? `${solBalance.toFixed(2)} SOL` : "Loading..."}
          </p>
        </div>
        <p className="text-sm sm:text-base font-semibold">
          {usdEquivalent !== null ? `$${usdEquivalent.toFixed(2)}` : "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default WalletInfoSection;
