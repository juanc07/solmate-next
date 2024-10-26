"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  // Function to dynamically assign classes based on active route
  const linkClass = (path: string) =>
    `text-xs sm:text-sm ${
      pathname === path ? 'bg-blue-500 text-white' : 'bg-transparent text-black'
    } px-3 py-2 rounded-md transition-colors duration-300`;

  // Function to handle closing the menu when a link is clicked (useful for mobile)
  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Hamburger button for mobile */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {/* Icon for hamburger menu */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  // Icon for closing the menu
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  // Icon for opening the menu
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

          {/* Navigation links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
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
      </div>

      {/* Mobile menu, show/hide based on menu state */}
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
