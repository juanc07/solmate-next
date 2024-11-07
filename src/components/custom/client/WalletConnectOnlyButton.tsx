"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { FaWallet } from "react-icons/fa";
import React from "react";

export const WalletConnectOnlyButton: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();

  const handleConnectClick = () => {
    if (!connected) {
      openWalletModal(true); // Open wallet modal if not connected
    }
  };

  return (
    <div className="flex w-full">
      {/* Display custom Connect Wallet button if not connected */}
      {!connected && (
        <button
          onClick={handleConnectClick}
          className="w-full flex-grow py-2 px-4 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors duration-200 flex items-center justify-center"
          style={{
            maxWidth: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaWallet className="mr-2" />
          Connect Wallet
        </button>
      )}
      {/* If connected, display the public key as confirmation */}
      {connected && (
        <div className="w-full text-center py-2 px-4 bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center">
          {`${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`}
        </div>
      )}
    </div>
  );
};
