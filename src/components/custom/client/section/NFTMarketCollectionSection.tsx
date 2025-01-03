import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react"; // ShadCN Loading Spinner
import NFTCard from "@/components/custom/client/NFTCard"; // Import the NFTCard component
import { Button } from "@/components/ui/button"; // Import ShadCN Button

// Example Dummy NFT Data with category, solPrice, and collectionName
const dummyNFTs = [
  { mintAddress: "0", name: "Solmate Collection #0", image: "/images/nft/solmate-nft0.jpg", category: "Art", solPrice: 1.5, collection: "Solmate" },
  { mintAddress: "1", name: "Solmate Collection #1", image: "/images/nft/solmate-nft1.webp", category: "Music", solPrice: 3.0, collection: "Harmony Beats" },
  { mintAddress: "2", name: "Solmate Collection #2", image: "/images/nft/solmate-nft2.webp", category: "Gaming", solPrice: 2.25, collection: "Gamers Delight" },
  { mintAddress: "3", name: "Solmate Collection #3", image: "/images/nft/solmate-nft3.webp", category: "Art", solPrice: 4.0, collection: "Solmate" },
  { mintAddress: "4", name: "Solmate Collection #4", image: "/images/nft/solmate-nft4.webp", category: "Music", solPrice: 1.75, collection: "Harmony Beats" },
  { mintAddress: "5", name: "Solmate Collection #5", image: "/images/nft/solmate-nft5.webp", category: "Gaming", solPrice: 2.5, collection: "Gamers Delight" },
  { mintAddress: "6", name: "Solmate Collection #6", image: "/images/nft/solmate-nft6.webp", category: "Art", solPrice: 5.0, collection: "Artistic Visions" },
  { mintAddress: "7", name: "Solmate Collection #7", image: "/images/nft/solmate-nft7.jpg", category: "Photography", solPrice: 3.75, collection: "Pixel Paradise" },
  { mintAddress: "8", name: "Solmate Collection #8", image: "/images/nft/solmate-nft8.webp", category: "Gaming", solPrice: 1.0, collection: "Gamers Delight" },
  { mintAddress: "9", name: "Solmate Collection #9", image: "/images/nft/solmate-nft9.webp", category: "Music", solPrice: 2.75, collection: "Harmony Beats" },
  { mintAddress: "10", name: "Solmate Collection #10", image: "/images/nft/solmate-nft10.webp", category: "Collectibles", solPrice: 3.2, collection: "Rare Finds" },
  { mintAddress: "11", name: "Solmate Collection #11", image: "/images/nft/solmate-nft11.webp", category: "Art", solPrice: 4.8, collection: "Artistic Visions" },
  { mintAddress: "12", name: "Solmate Collection #12", image: "/images/nft/solmate-nft12.webp", category: "Photography", solPrice: 2.9, collection: "Pixel Paradise" },
];

const NFTMarketCollectionSection = () => {
  const [nfts, setNfts] = useState(dummyNFTs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("name"); 
  const [loading, setLoading] = useState(true);
  const [filteredNFTs, setFilteredNFTs] = useState(dummyNFTs);

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };
    fetchNFTs();
  }, []);

  const handleSearch = () => {
    const searchValue = searchQuery.toLowerCase();
    const results = nfts.filter((nft) => {
      if (filterBy === "name") return nft.name.toLowerCase().includes(searchValue);
      if (filterBy === "mintAddress") return nft.mintAddress.toLowerCase().includes(searchValue);
      if (filterBy === "category") return nft.category.toLowerCase().includes(searchValue);
      if (filterBy === "solPrice") return nft.solPrice.toString().startsWith(searchValue);
      if (filterBy === "collectionName") return nft.collection?.toLowerCase().includes(searchValue);
      return false;
    });
    setFilteredNFTs(results);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-violet-600 w-16 h-16" />
        <p className="mt-4 text-xl text-gray-500"> Loading Nfts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-full px-4 py-6 md:px-6 lg:px-8 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg rounded-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">NFT Market</h2>

      {/* Search Bar, Filter Dropdown, and Search Button */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 w-full max-w-xl mx-auto">
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
          <option value="mintAddress">MintAddress</option>
          <option value="category">Category</option>
          <option value="solPrice">SOL Price</option>
          <option value="collectionName">Collection Name</option>
        </select>

        <Button onClick={handleSearch} className="px-4 py-2 bg-violet-600 text-white rounded-md w-full sm:w-auto">
          Search
        </Button>
      </div>

      {filteredNFTs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredNFTs.map((nft) => (
            <NFTCard
              key={nft.mintAddress}
              mintAddress={nft.mintAddress}
              name={nft.name}
              image={nft.image}
              solPrice={nft.solPrice}
              collection={nft.collection}
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

export default NFTMarketCollectionSection;
