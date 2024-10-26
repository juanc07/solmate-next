"use client";

import Sidebar from "@/components/custom/client/Sidebar";
import GreetingSection from "@/components/custom/client/GreetingSection";
import PortfolioSection from "@/components/custom/client/PortfolioSection";
import { useState, useEffect } from "react";

// Dummy token data
const tokens = [
  { name: "Solana", symbol: "SOL", balance: 10.5, change24h: 2.3 },
  { name: "USDC", symbol: "USDC", balance: 250.0, change24h: 0.1 },
  { name: "Raydium", symbol: "RAY", balance: 100, change24h: -1.4 },
];

const Portfolio = ({ walletAddress }: { walletAddress: string }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="min-h-screen grid"
      style={{
        gridTemplateColumns: isCollapsed ? "5rem auto" : "15rem auto",
      }}
    >
      <Sidebar isCollapsed={isCollapsed} />

      <main className="p-8">        
        <PortfolioSection tokens={tokens} />
      </main>
    </div>
  );
};

export default Portfolio;
