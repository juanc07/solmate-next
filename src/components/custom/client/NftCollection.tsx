"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/custom/client/Sidebar";
import { useWallet } from "@solana/wallet-adapter-react"; // Solana Wallet Adapter
import NFTCollectionSection from "./section/NFTCollectionSection";
import { useRouter } from "next/navigation"; // Next.js router

const NftCollection = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { connected } = useWallet(); // Check connection status
  const router = useRouter(); // Initialize router

  // Handle sidebar collapse on window resize
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect to home if the wallet is not connected
  useEffect(() => {
    if (!connected) {
      router.replace("/"); // Redirect to home page
    }
  }, [connected, router]);

  // Prevent rendering if the wallet is not connected
  if (!connected) return null;

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 flex-shrink-0 ${
          isCollapsed ? "w-20" : "w-60"
        } bg-black dark:bg-gray-800`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-6 sm:p-8 md:p-10 lg:p-12">
          <NFTCollectionSection />
        </div>
      </main>
    </div>
  );
};

export default NftCollection;
