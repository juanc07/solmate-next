"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button"; // ShadCN UI Button
import {WalletConnectButton} from '@/components/custom/client/WalletConnectButton'

export default function Header() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) return storedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

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

  return (
    <header className="bg-gray-800 text-white flex justify-between items-center h-16 w-full px-4 sm:px-6 lg:px-8">
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
        <div>
            <WalletConnectButton/>            
        </div>
        {/* Theme Toggle Button */}
        <Button
          variant="outline"
          className="w-10 h-10 p-0 rounded-full"
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
