"use client";

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
}) => (
  <div className="max-w-md w-full mx-auto space-y-6">
    
    {/* Wallet Address Card */}
    <div
      className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-violet-600 to-violet-900 
                 text-white dark:from-violet-700 dark:to-violet-950"
    >
      <h3 className="text-lg font-medium text-center mb-2">
        Wallet Address
      </h3>
      <p className="font-mono text-center text-sm sm:text-base md:text-lg break-all">
        {walletAddress}
      </p>
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

export default WalletInfoSection;
