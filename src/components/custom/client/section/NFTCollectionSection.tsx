"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Loader2 } from "lucide-react"; // ShadCN Loading Spinner

// Example Dummy NFT Data
const dummyNFTs = [
  { id: "0", name: "Solmate NFT Collection #0", image: "/images/nft/solmate-nft0.jpg" },
  { id: "1", name: "Solmate NFT Collection #1", image: "/images/nft/solmate-nft1.webp" },
  { id: "2", name: "Solmate NFT Collection #2", image: "/images/nft/solmate-nft2.webp" },
  { id: "3", name: "Solmate NFT Collection #3", image: "/images/nft/solmate-nft3.webp" },
  { id: "4", name: "Solmate NFT Collection #4", image: "/images/nft/solmate-nft4.webp" },
  { id: "5", name: "Solmate NFT Collection #5", image: "/images/nft/solmate-nft5.webp" },
  { id: "6", name: "Solmate NFT Collection #6", image: "/images/nft/solmate-nft6.webp" },
  { id: "7", name: "Solmate NFT Collection #7", image: "/images/nft/solmate-nft7.webp" },
  { id: "8", name: "Solmate NFT Collection #8", image: "/images/nft/solmate-nft8.webp" },
  { id: "9", name: "Solmate NFT Collection #9", image: "/images/nft/solmate-nft9.webp" },
  { id: "10", name: "Solmate NFT Collection #10", image: "/images/nft/solmate-nft10.webp" },
  { id: "11", name: "Solmate NFT Collection #11", image: "/images/nft/solmate-nft11.webp" },
  { id: "12", name: "Solmate NFT Collection #12", image: "/images/nft/solmate-nft12.webp" },
];

const NFTCollectionSection = () => {
  const [nfts, setNfts] = useState(dummyNFTs);
  const [loading, setLoading] = useState(true);

  // Simulate fetching NFT data from an API
  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      setLoading(false);
    };

    fetchNFTs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-violet-600 w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg rounded-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">NFT Collection</h2>

      {nfts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-center"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-lg font-medium mt-3 text-center">{nft.name}</h3>
              <p className="text-sm text-gray-500">Token ID: {nft.id}</p>
              <Button className="mt-3 w-full" variant="default">
                View Details
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No NFTs found.</p>
      )}
    </div>
  );
};

export default NFTCollectionSection;
