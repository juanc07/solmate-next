"use client"; // Indicate this is a client component

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react"; // ShadCN Loading Spinner
import { Button } from "@/components/ui/button"; // Import ShadCN Button
import NFTCardUI from "../NFTCardUI";
import { IProcessedNFT } from "@/lib/interfaces/processNft"; // Import the IProcessedNFT interface
import { openDB, IDBPDatabase } from "idb"; // Import idb for IndexedDB interactions

const DB_NAME = 'NFTImageCache';
const IMAGE_STORE_NAME = 'images';
const SKIPPED_STORE_NAME = 'skippedImages';
const MAX_CACHE_ENTRIES = 100; // Set a limit for the number of cached images
const MAX_IMAGE_SIZE_MB = 2; // Maximum image size in MB
const BATCH_SIZE = 10; // Number of images processed per batch for caching
const ENABLE_CACHING = false; // Toggle this to `false` to disable caching

// Initialize IndexedDB
const initDB = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(IMAGE_STORE_NAME)) {
        db.createObjectStore(IMAGE_STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SKIPPED_STORE_NAME)) {
        db.createObjectStore(SKIPPED_STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

// Helper function to get a cached image from IndexedDB
const getCachedImage = async (id: string): Promise<Blob | null> => {
  if (!ENABLE_CACHING) return null;
  const db = await initDB();
  const cachedData = await db.get(IMAGE_STORE_NAME, id);
  return cachedData ? cachedData.imageBlob : null;
};

// Helper function to cache an image in IndexedDB
const cacheImage = async (id: string, imageBlob: Blob): Promise<void> => {
  if (!ENABLE_CACHING) return;
  const db = await initDB();
  const store = db.transaction(IMAGE_STORE_NAME, 'readwrite').objectStore(IMAGE_STORE_NAME);

  const count = await store.count();
  if (count >= MAX_CACHE_ENTRIES) {
    const allKeys = await store.getAllKeys();
    if (allKeys.length > 0) {
      await store.delete(allKeys[0]); // Remove the oldest entry
    }
  }

  await store.put({ id, imageBlob });
};

// Helper function to mark an image as skipped
const markImageAsSkipped = async (id: string): Promise<void> => {
  if (!ENABLE_CACHING) return;
  const db = await initDB();
  const store = db.transaction(SKIPPED_STORE_NAME, 'readwrite').objectStore(SKIPPED_STORE_NAME);
  await store.put({ id });
};

// Helper function to check if an image is marked as skipped
const isImageSkipped = async (id: string): Promise<boolean> => {
  if (!ENABLE_CACHING) return false;
  const db = await initDB();
  const skippedData = await db.get(SKIPPED_STORE_NAME, id);
  return !!skippedData;
};

// Function to fetch image as blob
const fetchImageAsBlob = async (url: string): Promise<Blob | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    if (blob.size / (1024 * 1024) > MAX_IMAGE_SIZE_MB) {
      console.warn(`Image size exceeds ${MAX_IMAGE_SIZE_MB} MB, marking as skipped`);
      return null;
    }

    return blob;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

const NftCollectionSection = () => {
  const { publicKey, connected, wallet } = useWallet();
  const [nfts, setNfts] = useState<IProcessedNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false); // Track dialog visibility
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [filterBy, setFilterBy] = useState("name"); // State for filter option
  const [filteredNfts, setFilteredNfts] = useState<IProcessedNFT[]>([]); // Initial filtered NFT state with data
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Adjustable number of items per page
  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage);

  const router = useRouter();
  const hasFetchedData = useRef(false);

  const processBatchImages = async (nfts: IProcessedNFT[]) => {
    for (let i = 0; i < nfts.length; i += BATCH_SIZE) {
      const batch = nfts.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (nft) => {
          if (await isImageSkipped(nft.id)) {
            console.log(`Skipping large image ${nft.id}`);
            return nft;
          }

          const cachedImage = await getCachedImage(nft.id);
          if (cachedImage) {
            console.log("nft collection used cached blob image");
            const imageUrl = URL.createObjectURL(cachedImage);
            return { ...nft, image: imageUrl };
          } else if (nft.image) {
            const imageBlob = await fetchImageAsBlob(nft.image);
            if (imageBlob) {
              await cacheImage(nft.id, imageBlob);
              console.log("nft collection cached new blob image");
              const imageUrl = URL.createObjectURL(imageBlob);
              return { ...nft, image: imageUrl };
            } else {
              await markImageAsSkipped(nft.id); // Mark the image as skipped
            }
          }
          return nft;
        })
      );
    }
  };

  // Fetch NFT data from the proxy server
  const fetchNftData = useCallback(async () => {
    if (!connected || !publicKey || hasFetchedData.current) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/solana-data?publicKey=${publicKey.toString()}&fetchNFTs=true`);
      if (!response.ok) throw new Error("Failed to fetch NFT data");
      const { nfts } = await response.json();

      const initialNfts = (nfts as IProcessedNFT[]).slice(0, itemsPerPage).map((nft) => ({
        ...nft,
        image: nft.image,
      }));

      setNfts(initialNfts);
      setFilteredNfts(initialNfts);

      if (ENABLE_CACHING) {
        processBatchImages((nfts as IProcessedNFT[]).slice(itemsPerPage));
      }

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-violet-600 w-16 h-16 mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading NFT data...</p>
      </div>
    );
  }

  const handleSearch = () => {
    const results = nfts.filter(nft => {
      const searchValue = searchQuery.toLowerCase();
      if (filterBy === "name") return nft.name.toLowerCase().includes(searchValue);
      if (filterBy === "mintAddress") return nft.id.toLowerCase().includes(searchValue);
      if (filterBy === "solPrice") return nft.solPrice?.toString().startsWith(searchValue);
      if (filterBy === "collection") return nft.collection && nft.collection.toLowerCase().includes(searchValue);
      return false;
    });
    setFilteredNfts(results);
    setCurrentPage(1);
  };

  const currentNFTs = filteredNfts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
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
            <option value="solPrice">SOL Price</option>
            <option value="collection">Collection</option>
          </select>
          <Button onClick={handleSearch} className="px-4 py-2 bg-violet-600 text-white rounded-md w-full sm:w-auto">
            Search
          </Button>
        </div>

        {filteredNfts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 w-full">
              {currentNFTs.map((nft) => (
                <NFTCardUI
                  key={nft.id}
                  id={nft.id}
                  name={nft.name}
                  image={nft.image}
                  description={nft.description || ""}
                  collection={nft.collection}
                />
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <Button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2">
                Previous
              </Button>
              <span className="text-gray-600 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2">
                Next
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No NFTs found.</p>
        )}
      </div>
    </>
  );
};

export default NftCollectionSection;
