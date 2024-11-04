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
}

const NFTCardUI: React.FC<NFTCardProps> = ({ id, name, image, collection, description }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const defaultImage = "/images/nft/default-nft.webp"; // Path to default image

  // Determine which image to use
  const imageSrc = image && image.trim() ? image : defaultImage;
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
          onLoad={() => setIsLoading(false)}
          unoptimized
        />
      </div>

      <h3 className="mt-3 text-center font-medium text-lg sm:text-base md:text-lg lg:text-xl">{name}</h3>
      {/*{collection && <p className="text-sm text-gray-500 text-center mt-1">{collection}</p>}*/}

      {/* Include the NFTDetailsPopup component */}
      <NFTDetailsPopup id={id} name={name} image={imageSrc} description={description} collection={collection} />
    </div>
  );
};

export default NFTCardUI;
