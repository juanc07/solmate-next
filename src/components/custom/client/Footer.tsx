"use client";

import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-200 dark:text-gray-400 py-6 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand Name and Copyright */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h4 className="text-lg font-bold">Solmate</h4>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Solmate. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            <Link href="/privacyPolicy" passHref>
              <span className="text-sm hover:text-white dark:hover:text-gray-300 transition-colors">
                Privacy Policy
              </span>
            </Link>
            <Link href="/termOfService" passHref>
              <span className="text-sm hover:text-white dark:hover:text-gray-300 transition-colors">
                Terms of Service
              </span>
            </Link>
            <Link href="/contact" passHref>
              <span className="text-sm hover:text-white dark:hover:text-gray-300 transition-colors">
                Contact Us
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
