"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/custom/client/Sidebar";
import { useWallet } from "@solana/wallet-adapter-react"; // Solana Wallet Adapter
import FollowWalletSection from "./section/FollowWalletSection";

const FollowWallet = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { connected } = useWallet(); // Check connection status

  // Handle sidebar collapse on window resize
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent rendering if the wallet is not connected
  if (!connected) return null;

  return (
    <div className="h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-60"
        } bg-gray-800 dark:bg-gray-900 flex-shrink-0 h-full`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-6 sm:p-8 md:p-10 lg:p-12 space-y-8">
          <FollowWalletSection />
        </div>
      </main>
    </div>
  );
};

export default FollowWallet;
