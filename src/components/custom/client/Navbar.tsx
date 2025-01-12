"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ArrowsRightLeftIcon,
  WalletIcon,
  CubeIcon,
  NewspaperIcon,
  InformationCircleIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle
  const [isMobile, setIsMobile] = useState(false); // State to detect screen size
  const pathname = usePathname(); // Get current route

  // Function to dynamically assign classes based on active route
  const linkClass = (path: string) =>
    `flex items-center justify-start px-4 py-2 rounded-md transition-colors duration-300 ${
      pathname === path
        ? "bg-violet-600 text-white"
        : "bg-transparent text-gray-800 dark:text-gray-300"
    } hover:bg-violet-400 hover:text-white`;

  // Handle window resize to toggle between desktop and mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check on component mount
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  // Handle menu toggle on mobile
  const handleLinkClick = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <nav className="transition-colors duration-300 bg-[#f5f5f5] dark:bg-gray-900 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                <Link href="/" onClick={handleLinkClick} className={linkClass("/")}>
                  Home
                </Link>
                <Link href="/swapToken" onClick={handleLinkClick} className={linkClass("/swapToken")}>
                  Swap Token
                </Link>
                <Link href="/claimWepe" onClick={handleLinkClick} className={linkClass("/claimWepe")}>
                  Claim WEPE
                </Link>
                <Link href="/soulSpark" onClick={handleLinkClick} className={linkClass("/soulSpark")}>
                  SoulSpark
                </Link>
                <Link href="/walletActivity" onClick={handleLinkClick} className={linkClass("/walletActivity")}>
                  Wallet Activity
                </Link>
                <Link href="/nftMarket" onClick={handleLinkClick} className={linkClass("/nftMarket")}>
                  NFT
                </Link>
                <Link href="/news" onClick={handleLinkClick} className={linkClass("/news")}>
                  News
                </Link>
                <Link href="/about" onClick={handleLinkClick} className={linkClass("/about")}>
                  About Us
                </Link>
                <Link href="/contact" onClick={handleLinkClick} className={linkClass("/contact")}>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Floating Menu for Mobile */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50">
          {/* Floating Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-violet-500 text-white p-3 rounded-full shadow-lg"
            aria-label="Toggle floating menu"
          >
            {isOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Floating Menu Links */}
          {isOpen && (
            <div className="mt-2 bg-[#f5f5f5] dark:bg-gray-900 shadow-lg rounded-lg p-4 space-y-2">
              <Link href="/" onClick={handleLinkClick} className={linkClass("/")}>
                <HomeIcon className="h-6 w-6 mr-2" /> Home
              </Link>
              <Link href="/swapToken" onClick={handleLinkClick} className={linkClass("/swapToken")}>
                <ArrowsRightLeftIcon className="h-6 w-6 mr-2" /> Swap Token
              </Link>
              <Link href="/claimWepe" onClick={handleLinkClick} className={linkClass("/claimWepe")}>
                <ArrowsRightLeftIcon className="h-6 w-6 mr-2" /> Claim WEPE
              </Link>
              <Link href="/soulSpark" onClick={handleLinkClick} className={linkClass("/soulSpark")}>
                <ArrowsRightLeftIcon className="h-6 w-6 mr-2" /> SoulSpark
              </Link>
              <Link href="/walletActivity" onClick={handleLinkClick} className={linkClass("/walletActivity")}>
                <WalletIcon className="h-6 w-6 mr-2" /> Wallet Activity
              </Link>
              <Link href="/nftMarket" onClick={handleLinkClick} className={linkClass("/nftMarket")}>
                <CubeIcon className="h-6 w-6 mr-2" /> NFT
              </Link>
              <Link href="/news" onClick={handleLinkClick} className={linkClass("/news")}>
                <NewspaperIcon className="h-6 w-6 mr-2" /> News
              </Link>
              <Link href="/about" onClick={handleLinkClick} className={linkClass("/about")}>
                <InformationCircleIcon className="h-6 w-6 mr-2" /> About Us
              </Link>
              <Link href="/contact" onClick={handleLinkClick} className={linkClass("/contact")}>
                <PhoneIcon className="h-6 w-6 mr-2" /> Contact Us
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
