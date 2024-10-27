"use client";

import Link from "next/link";
import { HomeIcon, WalletIcon, ChartBarIcon, SparklesIcon, CogIcon } from "@heroicons/react/24/solid";

const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <aside
    className={`h-screen bg-black dark:bg-gray-800 text-white shadow-lg transition-all duration-300 z-20 ${
      isCollapsed ? "w-20" : "w-60"
    }`}
  >
    <nav className="space-y-6 py-7 px-2">
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
        href="/dashboard"
        icon={<WalletIcon className="w-6 h-6" />}
        label="Wallets"
        isCollapsed={isCollapsed}
      />
      <SidebarLink
        href="/dashboard"
        icon={<SparklesIcon className="w-6 h-6" />}
        label="NFTs"
        isCollapsed={isCollapsed}
      />
      <SidebarLink
        href="/settings"
        icon={<CogIcon className="w-6 h-6" />}
        label="Settings"
        isCollapsed={isCollapsed}
      />
    </nav>
  </aside>
);

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
