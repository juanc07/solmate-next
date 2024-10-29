"use client";

import { useRouter } from "next/navigation";
import WalletInfoSection from "@/components/custom/client/section/WalletInfoSection";
import Sidebar from "@/components/custom/client/Sidebar";
import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";
import TokenItem from "@/components/custom/client/TokenItem"; // Import the new TokenItem component
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";

interface Token {
  mint: string;
  balance: number;
  icon: string;
  name: string;
  symbol: string;
  usdValue: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchTokenDataWithCache = async (mint: string): Promise<Token | null> => {
  const cachedToken = localStorage.getItem(mint);
  if (cachedToken) {
    console.log(`Using cached data for ${mint}`);
    return JSON.parse(cachedToken);
  }

  try {
    const response = await fetch(`/api/token/${mint}`);
    if (!response.ok) throw new Error("Failed to fetch token data");
    const tokenData = await response.json();

    const token: Token = {
      mint: tokenData.address,
      balance: 0,
      icon: tokenData.logoURI,
      name: tokenData.name,
      symbol: tokenData.symbol,
      usdValue: 0,
    };

    localStorage.setItem(mint, JSON.stringify(token));
    return token;
  } catch (error) {
    console.error(`Error fetching data for mint ${mint}:`, error);
    return null;
  }
};

const fetchTokens = async (
  connection: Connection,
  publicKey: PublicKey
): Promise<Token[]> => {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
    );

    const tokens: Token[] = [];

    for (const { account } of tokenAccounts.value) {
      const info = account.data.parsed.info;
      const mintAddress = info.mint;
      const tokenBalance = info.tokenAmount.uiAmount || 0;

      if (tokenBalance < 0.1) {
        console.log(`Skipping token ${mintAddress} with balance ${tokenBalance}`);
        continue;
      }

      await delay(5000);
      const tokenData = await fetchTokenDataWithCache(mintAddress);

      if (tokenData) {
        const usdValue = await SolanaPriceHelper.convertTokenToUSDC(
          tokenData.symbol,
          tokenBalance
        );

        tokens.push({
          ...tokenData,
          balance: tokenBalance,
          usdValue,
        });
      }
    }

    return tokens.sort((a, b) => b.usdValue - a.usdValue);
  } catch (error) {
    console.error("Failed to fetch tokens:", error);
    return [];
  }
};

const Portfolio = ({
  walletAddress,
  solBalance,
  usdEquivalent,
}: {
  walletAddress: string;
  solBalance: number | null;
  usdEquivalent: number | null;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { connected, publicKey, wallet } = useWallet();
  const router = useRouter();
  const [tokens, setTokens] = useState<Token[]>([]);

  const redirectToHome = useCallback(() => {
    router.replace("/");
  }, [router]);

  useEffect(() => {
    if (!connected) {
      redirectToHome();
    }
  }, [connected, redirectToHome]);

  useEffect(() => {
    const handleDisconnect = () => {
      redirectToHome();
    };

    wallet?.adapter?.on("disconnect", handleDisconnect);
    return () => {
      wallet?.adapter?.off("disconnect", handleDisconnect);
    };
  }, [wallet, redirectToHome]);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const env = process.env.NEXT_PUBLIC_SOLANA_ENV || "devnet";
    setSolanaEnvironment(env as SolanaEnvironment);
    console.log(`Using Solana environment: ${env}`);
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection(getSolanaEndpoint());
      fetchTokens(connection, publicKey).then(setTokens);
    }
  }, [connected, publicKey]);

  if (!connected) return null;

  return (
    <div className="h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      <aside
        className={`flex-shrink-0 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-60"
        } bg-gray-800 dark:bg-gray-900`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </aside>
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-6 sm:p-8 md:p-10 lg:p-12 space-y-8">
          <WalletInfoSection
            walletAddress={walletAddress}
            solBalance={solBalance}
            usdEquivalent={usdEquivalent ?? 0}
          />
          <div className="space-y-4">
            {tokens.map((token) => (
              <TokenItem
                key={token.mint}
                icon={token.icon}
                name={token.name}
                symbol={token.symbol}
                balance={token.balance}
                usdValue={token.usdValue}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
