import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// react query integration
import ReactQueryProvider from "@/components/custom/client/ReactQueryProvider";
import { WalletContextProvider } from "./providers/WalletContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: {
    default: 'Solmate | All Things Solana in One Place',
    template: '%s | Solmate', // Allows custom titles on pages
  },
  description: 'Solmate is your go-to platform for everything Solana: buy, sell, swap, track market trends, follow top wallets, and explore trending Solana tokens.',
  keywords: [
    'Solmate', 'Solana', 'Crypto Trading', 'Solana Tokens',
    'Meme Tokens', 'Swap Solana', 'Trending Tokens',
    'Crypto Wallet Tracking', 'DeFi', 'Solana Market'
  ],
  openGraph: {
    type: 'website',
    url: 'https://solmate.vercel.app',  // Replace with your actual domain
    title: 'Solmate | All Things Solana in One Place',
    description: 'Buy, sell, swap, and monitor the latest Solana trends with Solmate. Follow popular wallets, explore trending tokens, and stay on top of the Solana market.',
    siteName: 'Solmate',
    images: [
      {
        url: 'https://solmate.vercel.app/images/logo/solmate-logo.webp', // Update with the correct path to your logo
        width: 1200,
        height: 630,
        alt: 'Solmate Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@solmate',  // Replace with your actual Twitter handle
    title: 'Solmate | All Things Solana in One Place',
    description: 'Discover the world of Solana on Solmate. Buy, sell, swap, and track trending tokens, followed wallets, and market movements effortlessly.',
    images: ['https://solmate.vercel.app/images/logo/solmate-logo.webp'], // Correct path to your Twitter card image
  },
  icons: {
    icon: '/favicon.ico',  // Ensure your favicon is placed in the public directory
    appleTouchIcon: '/images/logo/solmate-logo.webp',  // Update Apple icon path if necessary
  },
};

export const viewport = 'width=device-width, initial-scale=1';



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletContextProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
