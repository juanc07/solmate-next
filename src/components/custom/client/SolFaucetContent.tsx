"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN/UI Button
import { Input } from "@/components/ui/input";   // ShadCN/UI Input

interface SolFaucetContentProps {
  solBalance: number | null;
  usdEquivalent: number;
}

const SolFaucetContent = ({ solBalance, usdEquivalent }: SolFaucetContentProps) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestSOL = async () => {
    try {
      const response = await fetch("/api/request-sol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: walletAddress }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.message}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-violet">
          Solana Devnet Faucet
        </h1>

        <div className="mb-4">
          <p className="text-center">
            <strong>SOL Balance:</strong> {solBalance ?? 0} SOL
          </p>
          <p className="text-center">
            <strong>USD Equivalent:</strong> ${usdEquivalent.toFixed(2)}
          </p>
        </div>

        <Input
          placeholder="Enter your Solana address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="mb-4"
        />

        <Button
          onClick={handleRequestSOL}
          className="w-full bg-violet hover:bg-violet-700 text-white py-2 px-4 rounded-md"
        >
          Request 0.1 SOL
        </Button>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default SolFaucetContent;
