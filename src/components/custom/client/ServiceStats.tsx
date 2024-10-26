"use client"; // Designates this as a Client Component

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ServiceStats: React.FC = () => {
  return (
    <div className="w-full py-8 flex flex-col items-center justify-center text-center bg-white dark:bg-black transition-colors duration-300">
      {/* Top Label */}
      <h1 className="text-3xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-8">
        At a Glance
      </h1>

      {/* Cards Container */}
      <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-6 sm:gap-4 md:gap-8 px-4">
        {/* First Card: Token Swaps */}
        <Card className="w-full sm:w-1/3 h-40 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors duration-300">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
              120K+
            </h2>
            <p className="text-lg text-center text-gray-800 dark:text-gray-200">
              Tokens Swapped
            </p>
          </CardContent>
        </Card>

        {/* Second Card: Wallets Tracked */}
        <Card className="w-full sm:w-1/3 h-40 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors duration-300">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
              5K+
            </h2>
            <p className="text-lg text-center text-gray-800 dark:text-gray-200">
              Wallets on Watchlists
            </p>
          </CardContent>
        </Card>

        {/* Third Card: NFTs Traded */}
        <Card className="w-full sm:w-1/3 h-40 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors duration-300">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
              15K+
            </h2>
            <p className="text-lg text-center text-gray-800 dark:text-gray-200">
              NFTs Traded
            </p>
          </CardContent>
        </Card>

        {/* Fourth Card: News Updates */}
        <Card className="w-full sm:w-1/3 h-40 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors duration-300">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
              50+
            </h2>
            <p className="text-lg text-center text-gray-800 dark:text-gray-200">
              Daily Ecosystem News Updates
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceStats;
