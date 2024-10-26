"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Ensure the icons are from Heroicons (which Tailwind recommends)
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; 

export default function Header() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check local storage for the saved theme or fallback to system preference
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
      <div className="flex space-x-2 sm:space-x-4 items-center">
        <Link
          href="/login"
          className="px-3 py-2 text-sm sm:text-base bg-gray-700 hover:bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-3 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Sign Up
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-blue-300" />
          )}
        </button>
      </div>
    </header>
  );
}
