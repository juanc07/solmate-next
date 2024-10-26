"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  // Function to dynamically assign classes based on active route
  const linkClass = (path: string) =>
    `text-xs sm:text-sm px-3 py-2 rounded-md transition-colors duration-300 ${
      pathname === path
        ? 'bg-violet-600 text-white'
        : 'bg-transparent text-gray-800 dark:text-gray-300'
    } hover:bg-violet-400 hover:text-white`;

  // Handle menu toggle on mobile
  const handleLinkClick = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Hamburger Menu Button for Mobile */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link href="/" onClick={handleLinkClick} className={linkClass('/')}>
              Home
            </Link>
            <Link href="/swapToken" onClick={handleLinkClick} className={linkClass('/swapToken')}>
              Swap Token
            </Link>
            <Link href="/tokens" onClick={handleLinkClick} className={linkClass('/tokens')}>
              Tokens
            </Link>
            <Link href="/wallets" onClick={handleLinkClick} className={linkClass('/wallets')}>
              Wallets
            </Link>
            <Link href="/nft" onClick={handleLinkClick} className={linkClass('/nft')}>
              NFT
            </Link>
            <Link href="/news" onClick={handleLinkClick} className={linkClass('/news')}>
              News
            </Link>
            <Link href="/about" onClick={handleLinkClick} className={linkClass('/about')}>
              About Us
            </Link>
            <Link href="/contact" onClick={handleLinkClick} className={linkClass('/contact')}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" onClick={handleLinkClick} className={linkClass('/')}>
              Home
            </Link>
            <Link href="/ourWork" onClick={handleLinkClick} className={linkClass('/ourWork')}>
              View our Work
            </Link>
            <Link href="/ourClient" onClick={handleLinkClick} className={linkClass('/ourClient')}>
              Our Clients
            </Link>
            <Link href="/upcomingEvent" onClick={handleLinkClick} className={linkClass('/upcomingEvent')}>
              Upcoming Events
            </Link>
            <Link href="/service" onClick={handleLinkClick} className={linkClass('/service')}>
              Services
            </Link>
            <Link href="/blog" onClick={handleLinkClick} className={linkClass('/blog')}>
              Blog
            </Link>
            <Link href="/about" onClick={handleLinkClick} className={linkClass('/about')}>
              About Us
            </Link>
            <Link href="/contact" onClick={handleLinkClick} className={linkClass('/contact')}>
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
