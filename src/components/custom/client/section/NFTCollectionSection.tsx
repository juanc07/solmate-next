"use client"; // Indicate this is a client component

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NFTCard from "@/components/custom/client/NFTCard"; // Import the NFTCard component
import { Loader2 } from "lucide-react"; // ShadCN Loading Spinner
import { Button } from "@/components/ui/button"; // Import ShadCN Button
import NFTCardUI from "../NFTCardUI";

const NftCollectionSection = () => {
  const { publicKey, connected, wallet } = useWallet();
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false); // Track dialog visibility
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [filterBy, setFilterBy] = useState("name"); // State for filter option
  //const [filteredNfts, setFilteredNfts] = useState<any[]>(dummyNFTs); // Initial filtered NFT state with dummy data
  const [filteredNfts, setFilteredNfts] = useState<any[]>([]); // Initial filtered NFT state with dummy data
  const router = useRouter();
  const hasFetchedData = useRef(false);

  // Fetch NFT data from the proxy server
  const fetchNftData = useCallback(async () => {
    if (!connected || !publicKey || hasFetchedData.current) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/solana-data?publicKey=${publicKey.toString()}&fetchNFTs=true`);
      if (!response.ok) throw new Error("Failed to fetch NFT data");
      const { nfts } = await response.json();      
      setNfts(nfts || []);
      setFilteredNfts(nfts || []);      
      hasFetchedData.current = true;
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey]);

  // Redirect if the wallet is not connected
  const handleRedirect = useCallback(() => {
    router.replace("/");
  }, [router]);

  useEffect(() => {
    if (connected && publicKey) {
      fetchNftData();
    } else {
      setShowDialog(true); // Show dialog if not connected
    }
  }, [connected, publicKey, fetchNftData]);

  useEffect(() => {
    const handleDisconnect = () => handleRedirect();

    if (wallet?.adapter) {
      wallet.adapter.on("disconnect", handleDisconnect);
    }

    return () => {
      wallet?.adapter?.off("disconnect", handleDisconnect);
    };
  }, [wallet, handleRedirect]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-violet-600 w-16 h-16" />
      </div>
    );
  }

  // Filter NFTs based on search criteria when button is clicked
  const handleSearch = () => {
    const results = nfts.filter(nft => {
      const searchValue = searchQuery.toLowerCase();
      if (filterBy === "name") return nft.name.toLowerCase().includes(searchValue);
      if (filterBy === "mintAddress") return nft.mintAddress.toLowerCase().includes(searchValue);
      if (filterBy === "category") return nft.category && nft.category.toLowerCase().includes(searchValue);
      if (filterBy === "solPrice") return nft.solPrice.toString().startsWith(searchValue);
      if (filterBy === "collection") return nft.collection && nft.collection.toLowerCase().includes(searchValue);
      return false;
    });
    setFilteredNfts(results); // Update the filtered NFTs
  };

  return (
    <>
      {/* Wallet Connection Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wallet Not Connected</DialogTitle>
          </DialogHeader>
          <p>Please connect your wallet to proceed.</p>
          <DialogTrigger asChild>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowDialog(false)}
            >
              Okay
            </button>
          </DialogTrigger>
        </DialogContent>
      </Dialog>

      <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg rounded-lg w-full max-w-full mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">NFT Collection</h2>

        {/* Search Bar, Filter Dropdown, and Search Button */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <input
            type="text"
            placeholder={`Search by ${filterBy}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400"
          />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="name">Name</option>
            <option value="mintAddress">Mint Address</option>
            <option value="category">Category</option>
            <option value="solPrice">SOL Price</option>
            <option value="collection">Collection</option>
          </select>
          <Button onClick={handleSearch} className="px-4 py-2 bg-violet-600 text-white rounded-md w-full sm:w-auto">
            Search
          </Button>
        </div>

        {filteredNfts.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 w-full">
            {filteredNfts.map((nft) => (
              <NFTCardUI
              key={nft.id}
              id={nft.id}
              name={nft.name}
              image={nft.image}
              description={nft.description}
              collection={nft.collection}
            />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No NFTs found.</p>
        )}
      </div>
    </>
  );
};

export default NftCollectionSection;
