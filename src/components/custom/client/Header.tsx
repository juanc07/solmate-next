"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon, Bars3Icon } from "@heroicons/react/24/solid"; // Hamburger menu
import { Button } from "@/components/ui/button"; // ShadCN UI Button
import { WalletConnectButton } from "@/components/custom/client/WalletConnectButton";
import { useWallet } from "@solana/wallet-adapter-react"; // Solana Wallet Adapter
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { connected, wallet, publicKey } = useWallet(); // Extract wallet object
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      return storedTheme
        ? storedTheme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state

  // Register the disconnect event listener
  useEffect(() => {
    const handleDisconnect = () => {
      console.log("disconnected from wallet");            
      router.replace("/");      
    };

    if (wallet?.adapter) {
      wallet.adapter.on("disconnect", handleDisconnect);
    }

    // Cleanup on component unmount
    return () => {
      if (wallet?.adapter) {
        wallet.adapter.off("disconnect", handleDisconnect);
      }
    };
  }, [wallet]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDark((prev) => !prev);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev); // Toggle mobile menu

  return (
    <header className="bg-gray-800 dark:bg-black text-white flex items-center h-14 sm:h-16 w-full px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Logo and Brand Name */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo/solmate-logo-solo.png"
            alt="Solmate Logo"
            width={32}
            height={32}
            priority
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
          />
          <span className="ml-2 text-base sm:text-lg md:text-xl font-bold hidden sm:inline-block">
            Solmate
          </span>
        </Link>
      </div>

      {/* Hamburger Menu for Small Screens */}
      <div className="ml-auto sm:hidden">
        <button onClick={toggleMenu} aria-label="Toggle Menu">
          <Bars3Icon className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Action Buttons and Theme Toggle */}
      <div
        className={`flex-grow flex items-center justify-end space-x-2 sm:space-x-4 ${
          isMenuOpen ? "block" : "hidden"
        } sm:flex`}
      >
        {/* Conditionally Render Dashboard Link */}
        {connected ? (
          <Link
            href="/dashboard"
            className="text-white border border-violet-500 hover:bg-violet-600 hover:text-white dark:border-violet-400 dark:hover:bg-violet-500 transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base"
          >
            Dashboard
          </Link>
        ) : (
          <span className="hidden sm:inline text-gray-400">Connect Wallet</span>
        )}

        {/* Wallet Connect Button */}
        <div>
          <WalletConnectButton />
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="outline"
          className="w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-full border-gray-300 dark:border-gray-600 transition-colors duration-300"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <SunIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300" />
          )}
        </Button>
      </div>
    </header>
  );
}
