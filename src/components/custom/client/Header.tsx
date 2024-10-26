"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
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

            {/* Action Buttons */}
            <div className="flex space-x-2 sm:space-x-4 items-center">
                <Link href="/login" className="px-3 py-2 text-sm sm:text-base bg-gray-700 hover:bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 transition">
                    Login
                </Link>
                <Link href="/signup" className="px-3 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
                    Sign Up
                </Link>
            </div>
        </header>
    );
}
