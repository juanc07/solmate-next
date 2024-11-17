"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import NFTMarketCollectionSection from "./section/NFTMarketCollectionSection";
import { useRouter } from "next/navigation"; 

const NftMarketCollection = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);  

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);  

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">      
      <main className="flex-1 overflow-hidden">
        {/* 5% padding on left and right */}
        <div className="h-full overflow-auto px-[5%] py-6">
          <NFTMarketCollectionSection />
        </div>
      </main>
    </div>
  );
};

export default NftMarketCollection;
