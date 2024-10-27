"use client";

import GreetingSection from "@/components/custom/client/GreetingSection";
import Sidebar from "@/components/custom/client/Sidebar";
import PortfolioSection from "@/components/custom/client/PortfolioSection";
import { useState, useEffect } from "react";

// Dummy token data
const tokens = [
  { name: "Solana", symbol: "SOL", balance: 10.5, change24h: 2.3 },
  { name: "USDC", symbol: "USDC", balance: 250.0, change24h: 0.1 },
  { name: "Raydium", symbol: "RAY", balance: 100, change24h: -1.4 },
];

const Dashboard = ({ walletAddress, solBalance, usdEquivalent }: { 
  walletAddress: string; 
  solBalance: number | null; 
  usdEquivalent: number | null; 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      <aside className={`transition-all duration-300 ${isCollapsed ? "w-20" : "w-60"}`}>
        <Sidebar isCollapsed={isCollapsed} />
      </aside>
      <main className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 space-y-8">
        <GreetingSection 
          walletAddress={walletAddress} 
          solBalance={solBalance} 
          usdEquivalent={usdEquivalent} 
        />        
        <PortfolioSection tokens={tokens} />
      </main>
    </div>
  );
};

export default Dashboard;
