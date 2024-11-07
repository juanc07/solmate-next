import { useState, useEffect } from "react";
import Image from "next/image";
import { formatLargeNumber } from "@/lib/helper";

interface TokenItemProps {
  icon: string;
  name: string;
  symbol: string;
  balance: number;
  usdValue: number;
}

const defaultImage = "/images/token/default-token.png"; // Path to default image

// Asynchronous function to check if the proxy URL is valid
const getProxyUrl = async (imageUrl: string,type:string): Promise<string> => {
  try {
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}&type=${encodeURIComponent(type)}`;
    
    // Fetch headers only to verify if the image URL is valid
    const response = await fetch(proxyUrl, { method: 'HEAD' });
    const isValidImage = response.ok && response.headers.get("Content-Type")?.startsWith("image/");
    
    return isValidImage ? proxyUrl : defaultImage;
  } catch (error) {
    //console.error("Error in generating or validating proxy URL:", error);
    return defaultImage; // Fallback to default image if any error occurs
  }
};

const TokenItem = ({ icon, name, symbol, balance, usdValue }: TokenItemProps) => {
  const [imageSrc, setImageSrc] = useState(defaultImage);

  useEffect(() => {
    const fetchImageSrc = async () => {
      const src = icon && icon.trim() ? await getProxyUrl(icon,"token") : defaultImage;
      setImageSrc(src);
    };
    fetchImageSrc();
  }, [icon]);

  return (
    <div className="flex items-center p-6 bg-gray-100 bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-lg shadow-lg mx-auto max-w-md w-full mt-4">
      <div className="relative w-12 h-12 mr-4 border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          unoptimized
          sizes="(max-width: 768px) 50px, 100px"
          className="object-cover"
          onError={() => {
            setImageSrc(defaultImage); // Fallback if the image load fails
            console.warn(`Failed to load image for ${name}`);
          }}
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {name} <span className="text-gray-500 dark:text-gray-400">({symbol})</span>
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {formatLargeNumber(balance)} - ${usdValue?.toFixed(2) ?? "0.00"}
        </p>
      </div>
    </div>
  );
};

export default TokenItem;
