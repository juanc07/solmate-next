"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon, ArrowRightOnRectangleIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { WalletConnectButton } from "@/components/custom/client/WalletConnectButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/lib/useLocalStorage"; // Custom hook

export default function Header() {
  const router = useRouter();
  const { connected, wallet } = useWallet();

  // Use `useLocalStorage` to manage theme state with default as true (dark mode)
  const [getDarkMode, setDarkModeStorage] = useLocalStorage<boolean>("dark", true);

  // Initialize state from localStorage or default to dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getDarkMode() ?? true);

  // Apply the selected theme on every state change
  const applyTheme = (darkMode: boolean) => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // Apply the theme on component mount and whenever `isDarkMode` changes
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  // Handle wallet disconnect and redirect to home
  useEffect(() => {
    const handleDisconnect = () => {
      console.log("Disconnected from wallet");
      router.replace("/");
    };

    if (wallet?.adapter) {
      wallet.adapter.on("disconnect", handleDisconnect);
    }

    return () => {
      if (wallet?.adapter) {
        wallet.adapter.off("disconnect", handleDisconnect);
      }
    };
  }, [wallet, router]);

  // Toggle theme and save the new setting to localStorage
  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    //setDarkModeStorage(newDarkMode); // Save to localStorage
  };

  return (
    <header className="bg-gray-800 dark:bg-black text-white flex items-center justify-between h-16 w-full px-6 lg:px-8 transition-colors duration-300">
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <Image
            src="/images/logo/solmate-logo-solo.png"
            alt="Solmate Logo"
            width={40}
            height={40}
            priority
            className="h-10 w-10 object-contain"
          />
        </div>
        <span className="text-xl font-bold hidden sm:inline whitespace-nowrap">Solmate</span>
      </Link>


      {/* Action Buttons */}
      <div className="flex items-center space-x-6">
        {connected ? (
          <>
            <Link
              href="/dashboard"
              className="hidden sm:inline text-white border border-violet-500 hover:bg-violet-600 hover:text-white dark:border-violet-400 dark:hover:bg-violet-500 transition-all duration-300 px-4 py-2 rounded text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="sm:hidden p-2 rounded-full hover:bg-violet-600 transition-colors"
              aria-label="Dashboard"
            >
              <Squares2X2Icon className="h-6 w-6 text-white" />
            </Link>

            <button
              onClick={() => wallet?.adapter.disconnect()}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
              aria-label="Disconnect"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
            </button>
          </>
        ) : (
          <WalletConnectButton />
        )}

        {/* Theme Toggle Button */}
        <Button
          variant="outline"
          className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-gray-600 transition-colors duration-300"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-blue-300" />
          )}
        </Button>
      </div>
    </header>
  );
}
