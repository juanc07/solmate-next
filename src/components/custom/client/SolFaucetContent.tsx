"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input";   // ShadCN Input
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "@/components/ui/toast"; // ShadCN Toast components

interface SolFaucetContentProps {
  solBalance: number | null;
  usdEquivalent: number;
}

const SolFaucetContent = ({ solBalance, usdEquivalent }: SolFaucetContentProps) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false); // Toast visibility state

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

      // Show toast on success or failure
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500); // Hide after 2.5 seconds
    } catch (error) {
      console.error("Request failed:", error);
      setMessage("An unexpected error occurred.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500); // Hide after 2.5 seconds
    }
  };

  return (
    <ToastProvider>
      <div className="p-6 md:p-8 lg:p-10 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg rounded-lg max-w-3xl mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-6 text-center text-violet">
          Solana Devnet Faucet
        </h1>

        <div className="space-y-6">
          {/* Display SOL Balance and USD Equivalent */}
          <div className="flex justify-between">
            <p>
              <strong>SOL Balance:</strong> {solBalance ?? 0} SOL
            </p>
            <p>
              <strong>USD Equivalent:</strong> ${usdEquivalent.toFixed(2)}
            </p>
          </div>

          {/* Wallet Address Input */}
          <Input
            placeholder="Enter your Solana address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="mb-4"
          />

          {/* Request SOL Button */}
          <Button
            onClick={handleRequestSOL}
            className="w-full bg-violet hover:bg-violet-700 text-white py-2 px-4 rounded-md"
          >
            Request 0.1 SOL
          </Button>

          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        open={showToast}
        onOpenChange={setShowToast}
        className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg"
      >
        <ToastTitle className="font-bold">Faucet Response</ToastTitle>
        <ToastDescription>{message}</ToastDescription>
      </Toast>

      {/* Toast Viewport */}
      <ToastViewport className="fixed bottom-0 right-0 p-4" />
    </ToastProvider>
  );
};

export default SolFaucetContent;
