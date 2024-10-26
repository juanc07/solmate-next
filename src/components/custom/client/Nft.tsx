import React from 'react';

const NFT: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12">
      {/* Top Label */}
      <h1 className="text-4xl sm:text-5xl font-bold text-orange-600 mb-8">
      NFT
      </h1>

      {/* Coming Soon Label */}
      <div className="text-2xl sm:text-3xl font-semibold text-gray-700">
        Coming Soon...
      </div>
    </div>
  );
};

export default NFT;