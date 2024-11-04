import Image from "next/image";
import { formatLargeNumber, sanitizeImageUrl } from "@/lib/helper";

interface TokenItemProps {
  icon: string;
  name: string;
  symbol: string;
  balance: number;
  usdValue: number;
  sanitize?: boolean;
}

const TokenItem = ({ icon, name, symbol, balance, usdValue, sanitize = true }: TokenItemProps) => (
  <div className="flex items-center p-6 bg-gray-100 bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-lg shadow-lg mx-auto max-w-md w-full mt-4">
    <div className="relative w-12 h-12 mr-4 border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden">
      <Image
        src={sanitize ? sanitizeImageUrl(icon) : icon} // Conditionally sanitize the URL        
        alt={name}
        fill
        sizes="(max-width: 768px) 50px, 100px"
        className="object-cover"
        onError={() => console.warn(`Failed to load image for ${name}`)}
        unoptimized
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

export default TokenItem;
