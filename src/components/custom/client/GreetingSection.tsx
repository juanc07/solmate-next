"use client";

const GreetingSection = ({ walletAddress }: { walletAddress: string }) => (
  <div
    className="p-6 rounded-lg shadow-lg transition-all duration-300 
               bg-gradient-to-r from-violet-600 to-violet-900 
               text-white dark:from-violet-700 dark:to-violet-950"
  >
    <h2 className="text-3xl font-bold mb-2">Welcome back, adventurer!</h2>
    <p className="text-lg">
      Wallet: <span className="font-mono">{walletAddress}</span>
    </p>
    <p className="mt-2 text-lg">
      Total Balance: <span className="font-bold">$5,234.67 USD</span>
    </p>
  </div>
);

export default GreetingSection;
