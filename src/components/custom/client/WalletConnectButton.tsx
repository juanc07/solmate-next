"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Button } from "@/components/ui/button";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline"; // Door exit icon

export const WalletConnectButton = () => {
  const { connected, disconnect } = useWallet();

  return (
    <div className="flex items-center space-x-2">
      {/* Wallet Connect Button */}
      <WalletMultiButton />

      {/* Rounded Corner Exit Button */}
      {connected && (
        <Button
          onClick={disconnect}
          size="sm" // Small button size
          className="bg-red-500 text-white hover:bg-red-600 transition-all rounded-lg flex items-center justify-center"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
