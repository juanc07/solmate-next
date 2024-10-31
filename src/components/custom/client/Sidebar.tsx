"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HomeIcon,
  WalletIcon,
  ChartBarIcon,
  SparklesIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { DropletIcon } from "lucide-react";

const Sidebar = () => {
  // Check localStorage for the initial state to persist the toggle across page navigations
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isSidebarCollapsed") === "true";
    }
    return false;
  });

  const isDevnet = process.env.SOLANA_ENV === "devnet";

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const newCollapsedState = !prev;
      localStorage.setItem("isSidebarCollapsed", JSON.stringify(newCollapsedState));
      return newCollapsedState;
    });
  };

  useEffect(() => {
    // Sync state with localStorage
    localStorage.setItem("isSidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <aside
      className={`relative flex flex-col min-h-screen bg-black dark:bg-gray-800 text-white shadow-lg transition-all duration-300 z-20 ${
        isCollapsed ? "w-14" : "w-42" // Updated width for collapsed and expanded states
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 -right-4 w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-all"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-5 h-5" />
        ) : (
          <ChevronLeftIcon className="w-5 h-5" />
        )}
      </button>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-6 py-7 px-2 overflow-auto">
        <SidebarLink
          href="/dashboard"
          icon={<HomeIcon className="w-6 h-6" />}
          label="Dashboard"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          href="/portfolio"
          icon={<ChartBarIcon className="w-6 h-6" />}
          label="Portfolio"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          href="/followWallet"
          icon={<WalletIcon className="w-6 h-6" />}
          label="Wallets"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          href="/nftCollection"
          icon={<SparklesIcon className="w-6 h-6" />}
          label="NFTs"
          isCollapsed={isCollapsed}
        />
        {isDevnet && (
          <SidebarLink
            href="/solFaucet"
            icon={<DropletIcon className="w-6 h-6" />}
            label="SolFaucet"
            isCollapsed={isCollapsed}
          />
        )}
        <SidebarLink
          href="/settings"
          icon={<CogIcon className="w-6 h-6" />}
          label="Settings"
          isCollapsed={isCollapsed}
        />
      </nav>
    </aside>
  );
};

const SidebarLink = ({
  href,
  icon,
  label,
  isCollapsed,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center p-2 hover:bg-gray-700 dark:hover:bg-gray-900 rounded transition-all ${
      isCollapsed ? "justify-center" : ""
    }`}
  >
    {icon}
    {!isCollapsed && <span className="ml-4">{label}</span>}
  </Link>
);

export default Sidebar;
