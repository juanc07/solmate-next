import React from 'react';

const SwapToken: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black transition-colors duration-300 py-12">
      {/* Top Label */}
      <h1 className="text-4xl sm:text-5xl font-bold text-violet-600 dark:text-violet-400 mb-8">
        SwapToken
      </h1>

      {/* Coming Soon Label */}
      <div className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-300">
        Coming Soon...
      </div>
    </div>
  );
};

export default SwapToken;
