"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/custom/client/Sidebar";
import { useWallet } from "@solana/wallet-adapter-react";
import NFTCollectionSection from "./section/NFTCollectionSection";
import { useRouter } from "next/navigation"; 

const NftCollection = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!connected) {
      router.replace("/");
    }
  }, [connected, router]);

  if (!connected) return null;

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* 5% padding on left and right */}
        <div className="h-full overflow-auto px-[5%] py-6">
          <NFTCollectionSection />
        </div>
      </main>
    </div>
  );
};

export default NftCollection;
