"use client"; // Indicate this is a client component

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Loader2 } from "lucide-react"; // ShadCN Loading Spinner
import { INFT } from "@/lib/interfaces/nft"; // Adjust the import path if necessary
import { truncateString } from "@/lib/helper";

const NFTCard: React.FC<INFT> = ({
  name,
  image,
  solPrice,
  mintAddress,
  collection,
  category,
  uri,
}) => {
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const defaultImage = "/images/nft/default-nft.webp"; // Path to default image

  // Determine which image to use
  const imageSrc = image && image.trim() ? image : defaultImage;
  const altText = name ? name : ""; // Set alt text to an empty string if name is null or empty
  
  // Truncate mintAddress if it exists and is longer than 8 characters
  const truncatedMintAddress = mintAddress && mintAddress.trim()
    ? truncateString(mintAddress, 12) // Display 12 characters including ellipses
    : "N/A"; // Fallback if mintAddress is not available

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-center">
      <div className="relative w-full aspect-square overflow-hidden rounded-md">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <Loader2 className="animate-spin text-violet-600 w-12 h-12" />
          </div>
        )}

        <Image
          src={imageSrc} // Use the resolved image source
          alt={altText} // Use the determined alt text
          fill
          sizes="(max-width: 768px) 100vw, 
                 (max-width: 1200px) 50vw, 
                 33vw" // Responsive sizes for various screen widths
          className={`object-cover transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)} // Use onLoad to manage loading state
        />
      </div>

      <h3 className="mt-3 text-center font-medium text-lg sm:text-base md:text-lg lg:text-xl">
        {name}
      </h3>
      
      {collection && (
        <p className="text-sm text-gray-500 text-center mt-1">{collection}</p>
      )}
      {category && (
        <p className="text-sm text-gray-500 text-center mt-1">Category: {category}</p>
      )}
      {solPrice !== undefined && (
        <p className="text-sm text-gray-500 text-center mt-1">Price: {solPrice} SOL</p>
      )}

      <p className="text-sm text-gray-500 mt-2">Mint Address: {truncatedMintAddress}</p>
      <Button
        className="mt-3 w-full text-sm sm:text-xs md:text-sm lg:text-base"
        variant="default"
      >
        View Details
      </Button>
    </div>
  );
};

export default NFTCard;
