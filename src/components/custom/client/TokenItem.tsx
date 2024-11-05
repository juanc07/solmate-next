import Image from "next/image";
import { formatLargeNumber, sanitizeImageUrl } from "@/lib/helper";

interface TokenItemProps {
  icon: string;
  name: string;
  symbol: string;
  balance: number;
  usdValue: number;
}

const defaultImage = "/images/token/default-token.png"; // Path to default image

// Function to get the proxy URL
const getProxyUrl = (imageUrl: string) => {
  try {
    return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
  } catch {
    return defaultImage; // Fallback to default if encoding fails
  }
};

const TokenItem = ({ icon, name, symbol, balance, usdValue }: TokenItemProps) => {
  // Determine which image to use with the proxy URL
  const imageSrc = icon && icon.trim() ? getProxyUrl(icon) : defaultImage;

  return (
    <div className="flex items-center p-6 bg-gray-100 bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-lg shadow-lg mx-auto max-w-md w-full mt-4">
      <div className="relative w-12 h-12 mr-4 border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden">
        <Image
          src={imageSrc} // Conditionally sanitize the URL
          alt={name}
          fill
          sizes="(max-width: 768px) 50px, 100px"
          className="object-cover"
          onError={() => console.warn(`Failed to load image for ${name}`)}          
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {name} <span className="text-gray-500 dark:text-gray-400">({symbol})</span>
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {formatLargeNumber(balance)} - ${usdValue?.toFixed(2) ?? '0.00'}
        </p>
      </div>
    </div>
  );
};

export default TokenItem;
