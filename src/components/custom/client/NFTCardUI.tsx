"use client"; // Indicate this is a client component

import React from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react"; // ShadCN Loading Spinner
import NFTDetailsPopup from "./nft/NFTDetailsPopup"; // Import the new component

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  collection: string;
  description: string;
  solPrice?: number;
}

const NFTCardUI: React.FC<NFTCardProps> = ({ id, name, image, collection, description }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const defaultImage = "/images/nft/default-nft.webp"; // Path to default image

  // Function to get the proxy URL
  const getProxyUrl = (imageUrl: string,type:string) => {
    try {
      return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}&type=${encodeURIComponent(type)}`;
    } catch {
      return defaultImage; // Fallback to default if encoding fails
    }
  };

  // Determine which image to use with the proxy URL
  const imageSrc = image && image.trim() ? getProxyUrl(image,"nft") : defaultImage;
  const altText = name ? name : "";

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-center">
      <div className="relative w-full aspect-square overflow-hidden rounded-md">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <Loader2 className="animate-spin text-violet-600 w-12 h-12" />
          </div>
        )}

        <Image
          src={imageSrc}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
          unoptimized
          onLoad={() => setIsLoading(false)}          
        />
      </div>

      <h3 className="mt-3 text-center font-medium text-lg sm:text-base md:text-lg lg:text-xl">{name}</h3>
      {/* Include the NFTDetailsPopup component */}
      <NFTDetailsPopup id={id} name={name} image={imageSrc} description={description || ""} collection={collection} />
    </div>
  );
};

export default NFTCardUI;
