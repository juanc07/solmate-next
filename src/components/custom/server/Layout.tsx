// components/Layout.tsx
import Header from "@/components/custom/client/Header";
import Navbar from "@/components/custom/client/Navbar";
import Footer from "@/components/custom/client/Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_auto_1fr_auto]">
      {/* Header: Height based on content */}
      <header className="overflow-hidden">
        <Header />
      </header>

      {/* Navbar: Height based on content */}
      <nav className="overflow-hidden">
        <Navbar />
      </nav>

      {/* Main content: Takes remaining space */}
      <main className="overflow-auto">
        {children}
      </main>

      {/* Footer: Height based on content */}
      <footer className="overflow-hidden">
        <Footer />
      </footer>
    </div>
  );
}
