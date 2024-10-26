import React from 'react';
import Sidebar from '@/components/custom/client/Sidebar'
import GreetingSection from '@/components/custom/client/GreetingSection'
import PortfolioSection from '@/components/custom/client/PortfolioSection'

const Dashboard = () => {
  const walletAddress = "YourWalletAddressHere"; // Replace with real wallet data
  const tokens = [
    { name: 'Solana', balance: 10, symbol: 'SOL', change24h: 3.4 },
    { name: 'USDC', balance: 500, symbol: 'USDC', change24h: -0.1 },
  ]; // Replace with real token data

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
      <div className="flex">
        <Sidebar /> {/* Sidebar Navigation */}
        <main className="flex-grow p-8">
          <GreetingSection walletAddress={walletAddress} />
          <PortfolioSection tokens={tokens} />
          {/* Add other sections like RecentActivity, FavoriteTokens, and NFTGallery */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
