"use client";

const PortfolioSection = ({ 
  tokens 
}: { 
  tokens: Array<{ name: string; symbol: string; balance: number; change24h: number }> 
}) => (
  <div className="mt-6">
    <h2 className="text-2xl font-bold mb-4 text-violet-600 dark:text-violet-400">
      Your Portfolio
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tokens.map((token) => (
        <div
          key={token.symbol}
          className="p-5 rounded-lg shadow-lg bg-white dark:bg-black 
                     transition-transform hover:scale-105 border border-violet-500"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {token.name}
          </h3>
          <p className="text-gray-800 dark:text-gray-300">
            Balance: {token.balance} {token.symbol}
          </p>
          <p
            className={`mt-2 ${
              token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            Change (24h): {token.change24h}%
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default PortfolioSection;
