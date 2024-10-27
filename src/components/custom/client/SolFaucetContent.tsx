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

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (error) {
      console.error("Request failed:", error);
      setMessage("An unexpected error occurred.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex items-start justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        <div className="w-full max-w-4xl px-4 py-12 md:py-16 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
          <h1 className="text-3xl font-extrabold mb-8 text-center text-violet">
            Solana Devnet Faucet
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Display SOL Balance and USD Equivalent */}
            <div className="flex flex-col items-center md:items-start">
              <p className="text-lg">
                <strong>SOL Balance:</strong> {solBalance ?? 0} SOL
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <p className="text-lg">
                <strong>USD Equivalent:</strong> ${usdEquivalent.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Wallet Address Input */}
          <div className="mt-6">
            <Input
              placeholder="Enter your Solana address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full mb-4"
            />

            {/* Request SOL Button */}
            <Button
              onClick={handleRequestSOL}
              className="w-full bg-violet hover:bg-violet-700 text-white py-3 rounded-md"
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
      </div>
    </ToastProvider>
  );
};

export default SolFaucetContent;
