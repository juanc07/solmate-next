import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const WhoWeAreCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-black py-8 px-6 sm:px-8 lg:px-12 transition-colors duration-300">
      {/* Top Label */}
      <h1 className="text-3xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-8">
        Who We Are
      </h1>

      {/* Card */}
      <Card className="w-full max-w-3xl mx-auto shadow-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl font-semibold mb-2 text-black dark:text-white">
            Solmate
          </CardTitle>
        </CardHeader>
        <CardContent className="text-base sm:text-lg leading-relaxed space-y-4 text-gray-800 dark:text-gray-200">
          <p>
            Solmate is your gateway to the Solana ecosystem. Whether you’re swapping tokens, 
            tracking trends in meme coins, or keeping an eye on wallet addresses via your personalized watchlist, 
            we’ve got you covered.
          </p>
          <p>
            Explore NFT markets, stay updated on Solana ecosystem news, and participate in the latest DeFi activities. 
            Solmate connects you with everything happening in the world of Solana, all in one seamless platform.
          </p>
          <p>
            Whether you're an active trader, a collector, or a curious observer, Solmate brings the best of 
            the decentralized world straight to your fingertips.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhoWeAreCard;
