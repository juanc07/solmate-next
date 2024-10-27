"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input

const FollowWalletSection = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [followedWallets, setFollowedWallets] = useState<string[]>([]);

  const handleAddWallet = () => {
    if (walletAddress && !followedWallets.includes(walletAddress)) {
      setFollowedWallets((prev) => [...prev, walletAddress]);
      setWalletAddress(""); // Clear input
    }
  };

  const handleRemoveWallet = (address: string) => {
    setFollowedWallets((prev) => prev.filter((wallet) => wallet !== address));
  };

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 md:p-8 lg:p-10 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg rounded-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Follow Wallets
      </h2>

      <div className="space-y-4 flex-1 overflow-auto">
        {/* Input to Add Wallet */}
        <div className="flex space-x-2">
          <Input
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter Wallet Address"
            className="flex-1"
          />
          <Button onClick={handleAddWallet} variant="default">
            Follow
          </Button>
        </div>

        {/* List of Followed Wallets */}
        {followedWallets.length > 0 ? (
          <div className="mt-4 space-y-2">
            {followedWallets.map((wallet) => (
              <div
                key={wallet}
                className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded"
              >
                <span className="font-mono text-sm break-all">{wallet}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveWallet(wallet)}
                >
                  Unfollow
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            No wallets followed yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default FollowWalletSection;
