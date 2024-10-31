"use client"; // Ensures compatibility with Next.js App Router

import { createContext, useContext, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Import the .env setting
const networkEnv = process.env.NEXT_PUBLIC_SOLANA_ENV || "mainnet-beta";

const WalletContext = createContext({});

export const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Set network based on .env setting
  const network = useMemo(() => {
    switch (networkEnv) {
      case "mainnet-beta":
        return WalletAdapterNetwork.Mainnet;
      case "testnet":
        return WalletAdapterNetwork.Testnet;
      case "devnet":
        return WalletAdapterNetwork.Devnet;
      default:
        return WalletAdapterNetwork.Mainnet; // Fallback to Mainnet if none specified
    }
  }, [networkEnv]);

  const endpoint = clusterApiUrl(network);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
