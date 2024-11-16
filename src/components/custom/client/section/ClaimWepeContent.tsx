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

interface ClaimWepeContentProps {
  solBalance: number | null;
  usdEquivalent: number;
}

const ClaimWepeContent = ({ solBalance, usdEquivalent }: ClaimWepeContentProps) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false); // Toast visibility state

  const handleClaimToken = async () => {
    try {
      const response = await fetch("/api/claim-wepe-token", {
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
      <div className="min-h-screen min-w-full flex flex-col items-center justify-start bg-black text-gray-100 transition-colors duration-300">
        <div className="w-full max-w-4xl px-4 py-12 md:py-16 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-[15vh]">
          <div className="flex flex-col items-center md:items-start md:flex-row">
            <img
              src="/images/token/WEPE.jpg"
              alt="WEPE Token"
              className="w-24 h-24 rounded-full shadow-md mb-4 md:mb-0 md:mr-6"
            />
            <h1 className="text-3xl font-extrabold text-purple-600 text-center md:text-left">
              WEPE Token Claim
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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

          <div className="mt-8">
            <Input
              placeholder="Enter your Solana address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full mb-4"
            />

            <Button
              onClick={handleClaimToken}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md"
            >
              Claim 4000 WEPE Tokens
            </Button>

            {message && <p className="mt-4 text-center text-sm">{message}</p>}
          </div>
        </div>

        <Toast open={showToast} onOpenChange={setShowToast}>
          <ToastTitle>Claim Response</ToastTitle>
          <ToastDescription>{message}</ToastDescription>
        </Toast>
        <ToastViewport className="fixed bottom-0 right-0 p-4" />
      </div>
    </ToastProvider>
  );
};

export default ClaimWepeContent;
