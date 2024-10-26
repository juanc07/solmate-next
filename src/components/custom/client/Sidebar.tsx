"use client"; // Mark this as a Client Component

import Link from 'next/link';
import { useState } from 'react';
import {
  HomeIcon,
  WalletIcon,
  ChartBarIcon,
  SparklesIcon,
  CogIcon,
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Track sidebar state

  // Toggle the sidebar for mobile responsiveness
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <aside
      className={`${
        isOpen ? 'block' : 'hidden'
      } md:block bg-black dark:bg-gray-800 text-white dark:text-gray-200 w-64 space-y-6 py-7 px-3 fixed md:relative z-20 min-h-screen transition-all duration-300`}
    >
      {/* Toggle Button for Smaller Screens */}
      <button
        className="md:hidden text-white dark:text-gray-200 absolute top-4 right-4"
        onClick={toggleSidebar}
      >
        {isOpen ? 'Close' : 'Open'}
      </button>

      <Link href="/dashboard" className="text-xl font-bold block p-2">
        Dashboard
      </Link>

      <nav className="space-y-1">
        <Link
          href="/portfolio"
          className="flex items-center p-2 hover:bg-gray-700 dark:hover:bg-gray-900 rounded"
        >
          <ChartBarIcon className="w-6 h-6 mr-2" />
          Portfolio
        </Link>

        <Link
          href="/wallets"
          className="flex items-center p-2 hover:bg-gray-700 dark:hover:bg-gray-900 rounded"
        >
          <WalletIcon className="w-6 h-6 mr-2" />
          Wallets
        </Link>

        <Link
          href="/nfts"
          className="flex items-center p-2 hover:bg-gray-700 dark:hover:bg-gray-900 rounded"
        >
          <SparklesIcon className="w-6 h-6 mr-2" />
          NFTs
        </Link>

        <Link
          href="/settings"
          className="flex items-center p-2 hover:bg-gray-700 dark:hover:bg-gray-900 rounded"
        >
          <CogIcon className="w-6 h-6 mr-2" />
          Settings
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
