"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletConnectOnlyButton } from "../WalletConnectOnlyButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SolanaPriceHelper } from "@/lib/SolanaPriceHelper";
import Spinner from "../Spinner";
import { VersionedTransaction } from "@solana/web3.js";

const WSOL_ID = "So11111111111111111111111111111111111111112";

const ClaimWepeContent = () => {
  const { publicKey, connected, signTransaction } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [usdEquivalent, setUsdEquivalent] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);

  const fetchSolBalanceAndPrice = useCallback(async () => {
    if (!connected || !publicKey) return;

    setLoadingWallet(true);
    try {
      const response = await fetch(`/api/solana-data?publicKey=${publicKey.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch SOL balance");

      const { solBalance } = await response.json();
      const price = await SolanaPriceHelper.getTokenPriceInUSD("SOL", WSOL_ID);
      const usdValue = solBalance * price;

      setSolBalance(solBalance);
      setSolPrice(price);
      setUsdEquivalent(usdValue);
    } catch (error) {
      console.error("Error fetching SOL balance or price:", error);
      setSolBalance(0);
      setSolPrice(null);
      setUsdEquivalent(0);
    } finally {
      setLoadingWallet(false);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    if (connected && publicKey) fetchSolBalanceAndPrice();
    else {
      setSolBalance(null);
      setSolPrice(null);
      setUsdEquivalent(0);
    }
  }, [connected, publicKey, fetchSolBalanceAndPrice]);

  const handleClaimToken = async () => {
    try {
      if (!publicKey || !signTransaction) {
        setMessage("Wallet not ready for signing. Please connect.");
        setShowDialog(true);
        return;
      }

      const walletAddress = publicKey.toString();
      setLoadingClaim(true);

      const response = await fetch("/api/claim-wepe-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: walletAddress }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(`Error: ${data.error}`);
        setShowDialog(true);
        return;
      }

      const transactionBuffer = Uint8Array.from(Buffer.from(data.transaction, "base64"));
      const transaction = VersionedTransaction.deserialize(transactionBuffer);

      const signedTransaction = await signTransaction(transaction);

      const sendResponse = await fetch("/api/submit-signed-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedTransaction: Buffer.from(signedTransaction.serialize()).toString("base64"),
          recipient: walletAddress,
        }),
      });

      const sendResult = await sendResponse.json();
      if (sendResponse.ok) {
        setMessage(`Success: ${sendResult.message}`);
      } else {
        setMessage(`Error: ${sendResult.error}`);
      }

      setShowDialog(true);
    } catch (error) {
      console.error("Transaction failed:", error);
      setMessage("An unexpected error occurred during transaction signing or submission.");
      setShowDialog(true);
    } finally {
      setLoadingClaim(false);
    }
  };

  return (
    <div className="min-h-screen min-w-full flex flex-col items-center justify-start bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      {(loadingWallet || loadingClaim) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-4">
            <Spinner />
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {loadingWallet ? "Loading wallet data..." : "Processing your claim..."}
            </span>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl px-4 py-12 md:py-16 bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg mt-[10vh] relative">
        {/* Reviewed by text */}
        <div className="absolute top-4 right-4 text-sm text-gray-600 dark:text-gray-300 bg-opacity-75 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded shadow">
          Reviewed by{" "}
          <a
            href="https://blowfish.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-800 dark:hover:text-gray-100"
          >
            Blowfish.xyz #4362
          </a>
        </div>

        <div className="flex flex-col items-center md:items-start md:flex-row">
          <img
            src="/images/token/WEPE.jpg"
            alt="WEPE Token"
            className="w-24 h-24 rounded-full shadow-md mb-4 md:mb-0 md:mr-6"
          />
          <h1 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 text-center md:text-left">
            WEPE Token Claim
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-lg text-gray-900 dark:text-gray-100">
              <strong>SOL Balance:</strong> {solBalance ?? 0}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="text-lg text-gray-900 dark:text-gray-100">
              <strong>USD Equivalent:</strong> ${usdEquivalent.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-8">
          {!connected ? (
            <WalletConnectOnlyButton />
          ) : (
            <Button
              onClick={handleClaimToken}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md"
            >
              Claim 4000 WEPE Tokens
            </Button>
          )}
        </div>

        <div className="mt-8 text-center text-gray-700 dark:text-gray-300">
          <p>
            Thank you for supporting <strong>WEPE</strong>. Let’s build this community and thrive together.
            <br />
            <strong>In WEPE We Trust.</strong>
          </p>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md max-w-md mx-auto w-full">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Claim Response</DialogTitle>
            <DialogDescription className="text-gray-700 dark:text-gray-300">{message}</DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowDialog(false)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 mt-4 rounded-md"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClaimWepeContent;
