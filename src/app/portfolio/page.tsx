"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Layout from "@/components/custom/server/Layout";
import Portfolio from "@/components/custom/client/Portfolio";
import { useWallet } from "@solana/wallet-adapter-react"; // Wallet adapter
import { useRouter } from "next/navigation"; // Router for navigation
import { Connection, PublicKey } from "@solana/web3.js"; // Web3 utilities
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper"; // Helper class
import {obfuscatePublicKey,sanitizeUrl} from '@/lib/helper'

import {
  setSolanaEnvironment,
  getSolanaEndpoint,
  SolanaEnvironment,
} from "@/lib/config"; // Config utilities

const PortfolioPage = () => {
  const { publicKey, connected, wallet } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number>(0);
  const [usdEquivalent, setUsdEquivalent] = useState<number>(0); // Track USD equivalent
  const hasFetchedData = useRef(false); // Track if data has already been fetched
  const router = useRouter();

  // Set the Solana environment dynamically from environment variables
  useEffect(() => {
    const env = process.env.NEXT_PUBLIC_SOLANA_ENV || "devnet";
    setSolanaEnvironment(env as SolanaEnvironment);
    console.log(`Using Solana environment: ${env}`);
  }, []);

  // Redirect to home if the wallet is not connected
  const redirectToHome = useCallback(() => {
    console.log("Wallet not connected. Redirecting to home...");
    router.replace("/");
  }, [router]);

  useEffect(() => {
    if (!connected) {
      redirectToHome();
    }
  }, [connected, redirectToHome]);

  // Register a disconnect event listener
  useEffect(() => {
    const handleDisconnect = () => {
      console.log("Wallet disconnected. Redirecting to home...");
      redirectToHome();
    };

    if (wallet?.adapter) {
      wallet.adapter.on("disconnect", handleDisconnect);
    }

    return () => {
      if (wallet?.adapter) {
        wallet.adapter.off("disconnect", handleDisconnect);
      }
    };
  }, [wallet, redirectToHome]);

  // Fetch SOL balance and price if not already fetched
  useEffect(() => {
    const fetchSolBalanceAndPrice = async () => {
      try {
        if (publicKey && !hasFetchedData.current) {
          console.log(`Fetching balance for public key: ${obfuscatePublicKey(publicKey.toString())}`);          

          const connection = new Connection(getSolanaEndpoint());
          const balance = await connection.getBalance(new PublicKey(publicKey));
          const solBalanceValue = balance / 1e9; // Convert lamports to SOL
          console.log(`Fetched SOL balance: ${solBalanceValue} SOL`);
          setSolBalance(solBalanceValue);

          const price = await SolanaPriceHelper.getTokenPriceInUSD("SOL");
          console.log(`Fetched SOL price: $${price}`);
          setSolPrice(price);

          const usdValue = solBalanceValue * price;
          console.log(`USD Equivalent: $${usdValue}`);
          setUsdEquivalent(usdValue);

          hasFetchedData.current = true; // Mark data as fetched
        } else {
          console.warn("Public key not available or data already fetched.");
          setSolBalance(0);
          setUsdEquivalent(0);
        }
      } catch (error) {
        console.error("Error fetching SOL balance or price:", error);
        setSolBalance(0);
        setUsdEquivalent(0);
      }
    };

    if (connected) {
      fetchSolBalanceAndPrice();
    }
  }, [connected, publicKey]);

  // Prevent rendering if wallet is not connected
  if (!connected) return null;

  return (
    <Layout>
      <Portfolio
        walletAddress={publicKey?.toString() || ""}
        solBalance={solBalance}
        usdEquivalent={usdEquivalent}
      />
    </Layout>
  );
};

export default PortfolioPage;
