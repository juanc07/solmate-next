import Image from "next/image";
import {formatLargeNumber, sanitizeImageUrl } from "@/lib/helper";

interface TokenItemProps {
  icon: string;
  name: string;
  symbol: string;
  balance: number;
  usdValue: number;
}

const TokenItem = ({ icon, name, symbol, balance, usdValue }: TokenItemProps) => (
  <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md">
    <div className="relative w-10 h-10 mr-4">
      <Image
        src={sanitizeImageUrl(icon)}
        alt={name}
        fill
        sizes="(max-width: 768px) 50px, 100px"
        className="rounded-full object-cover"
        onError={() => console.warn(`Failed to load image for ${name}`)}
        unoptimized
      />
    </div>
    <div className="flex-1">
      <h3 className="font-medium">
        {name} ({symbol})
      </h3>
      <p className="text-sm text-gray-500">
        {formatLargeNumber(balance)} - ${usdValue?.toFixed(2) ?? '0.00'}
      </p>
    </div>
  </div>
);

export default TokenItem;
