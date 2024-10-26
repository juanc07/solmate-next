"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button"; // ShadCN UI Button
import { WalletConnectButton } from "@/components/custom/client/WalletConnectButton";
import { useWallet } from "@solana/wallet-adapter-react"; // Solana Wallet Adapter
import { useRouter } from "next/navigation"; // New router import

export default function Header() {
  const { connected } = useWallet(); // Track wallet connection status
  const router = useRouter(); // New router hook from next/navigation
  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted
  const [isDark, setIsDark] = useState<boolean>(false);

  // Ensure client-side logic
  useEffect(() => {
    setIsMounted(true); // Mark component as mounted
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setIsDark(storedTheme === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

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

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleDashboardRedirect = () => {
    router.push("/dashboard"); // Use the new router method from next/navigation
  };

  return (
    <header className="bg-gray-800 dark:bg-black text-white flex justify-between items-center h-16 w-full px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Logo and Brand Name */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo/solmate-logo-solo.png"
            alt="Solmate Logo"
            width={120}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
          <span className="ml-3 text-lg sm:text-xl font-bold">Solmate</span>
        </Link>
      </div>

      {/* Action Buttons and Theme Toggle */}
      <div className="flex space-x-4 items-center">
        {/* Conditionally Render Dashboard Button */}
        {connected && isMounted && (
          <Button
            variant="outline"
            className="text-white border-violet-500 hover:bg-violet-600 hover:text-white dark:border-violet-400 dark:hover:bg-violet-500 transition-all duration-300"
            onClick={handleDashboardRedirect}
          >
            Dashboard
          </Button>
        )}

        {/* Wallet Connect Button */}
        <div>
          <WalletConnectButton />
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="outline"
          className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-gray-600 transition-colors duration-300"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-blue-300" />
          )}
        </Button>
      </div>
    </header>
  );
}
