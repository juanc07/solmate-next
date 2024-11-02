"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react"; // ShadCN Loading Spinner
import NFTCard from "@/components/custom/client/NFTCard"; // Import the NFTCard component
import { Button } from "@/components/ui/button"; // ShadCN Button

// Example Dummy NFT Data with category, solPrice, and collectionName
const dummyNFTs = [
  { id: "0", name: "Solmate Collection #0", image: "/images/nft/solmate-nft0.jpg", category: "Art", solPrice: 1.5, collectionName: "Solmate" },
  { id: "1", name: "Solmate Collection #1", image: "/images/nft/solmate-nft1.webp", category: "Music", solPrice: 3.0, collectionName: "Harmony Beats" },
  { id: "2", name: "Solmate Collection #2", image: "/images/nft/solmate-nft2.webp", category: "Gaming", solPrice: 2.25, collectionName: "Gamers Delight" },
  { id: "3", name: "Solmate Collection #3", image: "/images/nft/solmate-nft3.webp", category: "Art", solPrice: 4.0, collectionName: "Solmate" },
  { id: "4", name: "Solmate Collection #4", image: "/images/nft/solmate-nft4.webp", category: "Music", solPrice: 1.75, collectionName: "Harmony Beats" },
  { id: "5", name: "Solmate Collection #5", image: "/images/nft/solmate-nft5.webp", category: "Gaming", solPrice: 2.5, collectionName: "Gamers Delight" },
  { id: "6", name: "Solmate Collection #6", image: "/images/nft/solmate-nft6.webp", category: "Art", solPrice: 5.0, collectionName: "Artistic Visions" },
  { id: "7", name: "Solmate Collection #7", image: "/images/nft/solmate-nft7.jpg", category: "Photography", solPrice: 3.75, collectionName: "Pixel Paradise" },
  { id: "8", name: "Solmate Collection #8", image: "/images/nft/solmate-nft8.webp", category: "Gaming", solPrice: 1.0, collectionName: "Gamers Delight" },
  { id: "9", name: "Solmate Collection #9", image: "/images/nft/solmate-nft9.webp", category: "Music", solPrice: 2.75, collectionName: "Harmony Beats" },
];

const NFTCollectionSection = () => {
  const [nfts, setNfts] = useState(dummyNFTs);
  const [filteredNFTs, setFilteredNFTs] = useState(dummyNFTs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("name");
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

  // Filter NFTs based on search query and selected filter
  const handleSearch = () => {
    const searchValue = searchQuery.toLowerCase();
    const results = nfts.filter((nft) => {
      if (filterBy === "name") return nft.name.toLowerCase().includes(searchValue);
      if (filterBy === "id") return nft.id.toLowerCase().includes(searchValue);
      if (filterBy === "category") return nft.category.toLowerCase().includes(searchValue);
      if (filterBy === "solPrice") return nft.solPrice.toString().startsWith(searchValue);
      if (filterBy === "collectionName") return nft.collectionName.toLowerCase().includes(searchValue);
      return false;
    });
    setFilteredNFTs(results);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-violet-600 w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg rounded-lg w-full max-w-full mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">NFT Collection</h2>

      {/* Search Bar, Filter Dropdown, and Search Button */}
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4 w-full">
        {/* Search Input */}
        <input
          type="text"
          placeholder={`Search by ${filterBy}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400"
        />

        {/* Filter Dropdown */}
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="name">Name</option>
          <option value="id">ID</option>
          <option value="category">Category</option>
          <option value="solPrice">SOL Price</option>
          <option value="collectionName">Collection Name</option>
        </select>

        {/* Search Button */}
        <Button onClick={handleSearch} className="px-4 py-2 bg-violet-600 text-white rounded-md">
          Search
        </Button>
      </div>

      {filteredNFTs.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 w-full">
          {filteredNFTs.map((nft) => (
            <NFTCard
              key={nft.id}
              id={nft.id}
              name={nft.name}
              image={nft.image}
              solPrice={nft.solPrice}
              collectionName={nft.collectionName}
              category={nft.category}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No NFTs found.</p>
      )}
    </div>
  );
};

export default NFTCollectionSection;
