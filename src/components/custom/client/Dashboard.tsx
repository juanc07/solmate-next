"use client";

import Sidebar from "@/components/custom/client/Sidebar";
import GreetingSection from "@/components/custom/client/GreetingSection";
import PortfolioSection from "@/components/custom/client/PortfolioSection";
import { useState, useEffect } from "react";

// Dummy data for portfolio (replace with real data if needed)
const tokens = [
  { name: "Solana", symbol: "SOL", balance: 10.5, change24h: 2.3 },
  { name: "USDC", symbol: "USDC", balance: 250.0, change24h: 0.1 },
  { name: "Raydium", symbol: "RAY", balance: 100, change24h: -1.4 },
];

const Dashboard = ({ walletAddress }: { walletAddress: string }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Collapse the sidebar on small screens
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check on load

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="min-h-screen grid bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300"
      style={{
        gridTemplateColumns: isCollapsed ? "5rem auto" : "15rem auto", // Adjust sidebar width
      }}
    >
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} />

      {/* Main Content */}
      <main className="p-8 space-y-8">
        {/* Greeting Section */}
        <GreetingSection walletAddress={walletAddress} />

        {/* Portfolio Section */}
        <PortfolioSection tokens={tokens} />
      </main>
    </div>
  );
};

export default Dashboard;
