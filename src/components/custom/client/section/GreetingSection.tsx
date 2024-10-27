"use client";

const GreetingSection = ({ 
  walletAddress, 
  solBalance, 
  usdEquivalent 
}: { 
  walletAddress: string; 
  solBalance: number | null; 
  usdEquivalent: number | null; 
}) => (
  <div
    className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-lg shadow-lg 
               bg-gradient-to-r from-violet-600 to-violet-900 
               text-white dark:from-violet-700 dark:to-violet-950
               max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto"
  >
    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center sm:text-left">
      Welcome back, adventurer!
    </h2>

    <div className="mb-4">
      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-1">
        Wallet Address
      </h3>
      <p className="font-mono break-all text-xs sm:text-sm md:text-base lg:text-lg">
        {walletAddress}
      </p>
    </div>

    <div className="flex justify-between items-center">
      <div className="flex-1">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
          SOL Balance
        </h3>
        <p className="font-bold text-xs sm:text-sm md:text-base lg:text-lg">
          {solBalance !== null ? `${solBalance} SOL` : "Loading..."}
        </p>
      </div>

      <div className="flex-1 text-right">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
          USD Equivalent
        </h3>
        <p className="font-bold text-xs sm:text-sm md:text-base lg:text-lg">
          {usdEquivalent !== null ? `$${usdEquivalent.toFixed(2)} USD` : "Loading..."}
        </p>
      </div>
    </div>
  </div>
);

export default GreetingSection;
