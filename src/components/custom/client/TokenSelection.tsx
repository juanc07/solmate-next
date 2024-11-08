// components/TokenSelection.tsx
import React from 'react';

interface TokenSelectionProps {
  name: string;
  symbol: string;
  logoURI: string;
  address: string;
  price: number;
  amount?: number;
}

const TokenSelection: React.FC<TokenSelectionProps> = ({ name, symbol, logoURI, address, price, amount = 0 }) => {
  const calculatedValue = (amount * price).toFixed(2); // Calculates USD value based on the entered amount

  return (
    <div className="flex items-center space-x-4 p-2 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
      <img src={logoURI} alt={`${name} logo`} className="h-8 w-8 rounded-full" />
      <div className="flex-1">
        <p className="font-semibold text-black dark:text-white">{name} ({symbol})</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{address}</p>
      </div>
      <div className="text-right">
        <p className="text-black dark:text-white">${price.toFixed(2)}</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">${calculatedValue}</p>
      </div>
    </div>
  );
};

export default TokenSelection;
