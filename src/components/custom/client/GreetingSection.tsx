"use client";

const GreetingSection = ({ walletAddress }: { walletAddress: string }) => (
  <div
    className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-lg shadow-lg transition-all duration-300
               bg-gradient-to-r from-violet-600 to-violet-900 
               text-white dark:from-violet-700 dark:to-violet-950
               max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto"
  >
    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center sm:text-left leading-tight">
      Welcome back, adventurer!
    </h2>
    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center sm:text-left leading-snug">
      Wallet: <span className="font-mono break-all">{walletAddress}</span>
    </p>
    <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-center sm:text-left">
      Total Balance: <span className="font-bold">$5,234.67 USD</span>
    </p>
  </div>
);

export default GreetingSection;
