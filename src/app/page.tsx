//"use client";

import Link from "next/link";
import ProductCard from "./components/ProductCard/ProductCard";
import Layout from "@/components/custom/server/Layout"
import Counter from "@/components/custom/client/Counter"
import Carousel from "@/components/custom/client/Carousel"
import WhoWeAreCard from "@/components/custom/client/WhoWeAreCard"
import ServiceStats from "@/components/custom/client/ServiceStats"
import UpcomingEvent from "@/components/custom/client/UpcomingEvent"
import Contact from "@/components/custom/client/Contact"
import HorizontalContactForm from "@/components/custom/client/HorizontalContactForm"

export const metadata = {
  title: 'Solmate | All-in-One Platform for Solana Trading, Swapping, and Trends',
  description: 'Solmate is your gateway to the Solana ecosystem. Buy, sell, swap tokens, track market trends, follow popular crypto wallets, and explore trending Solana tokens.',
  keywords: [
    'Solmate', 
    'Solana', 
    'Crypto Trading', 
    'Swap Tokens', 
    'Trending Tokens', 
    'Meme Tokens', 
    'Market Trends', 
    'Wallet Tracking', 
    'DeFi', 
    'Solana Platform'
  ],
  openGraph: {
    type: 'website',
    url: 'https://solmate.vercel.app',  // Replace with your live domain
    title: 'Solmate | All-in-One Platform for Solana Trading, Swapping, and Trends',
    description: 'Discover everything Solana on Solmate. Buy, sell, swap, and stay on top of the latest trends in the Solana ecosystem. Follow wallets of crypto influencers and track token performance.',
    siteName: 'Solmate',
    images: [
      {
        url: 'https://solmate.vercel.app/images/logo/solmate-logo.webp',  // Replace with the correct logo URL
        width: 1200,
        height: 630,
        alt: 'Solmate Logo',
      },
      {
        url: 'https://solmate.vercel.app/images/market-banner.jpg',  // Example image for a banner or promotional graphic
        width: 1200,
        height: 630,
        alt: 'Explore Solana Market on Solmate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@solmate',  // Replace with your actual Twitter handle
    title: 'Solmate | All-in-One Platform for Solana Trading, Swapping, and Trends',
    description: 'Stay connected with the Solana market on Solmate. Trade, swap, and follow token trends and popular crypto wallets all in one place.',
    images: ['https://solmate.vercel.app/images/market-banner.jpg'],  // Use your banner image for Twitter cards
  },
  icons: {
    icon: '/favicon.ico',  // Ensure this file is in your public folder
    appleTouchIcon: '/images/logo/solmate-logo.webp',  // Your custom Apple touch icon
  },
};

export const viewport = 'width=device-width, initial-scale=1';


export default function Home() { 
  return (
    <Layout>      
      <Carousel/>
      <WhoWeAreCard/>
      <ServiceStats/>      
      <Contact title="Contact Us"/>
      <HorizontalContactForm title="Message Us"/>
      {/*
      <h1>Hello world</h1>
      <Link href="/users">Users</Link> <br />
      <Link href="/ourWork">Our Work</Link> <br />
      <ProductCard />
      <Counter />
      */}
    </Layout>
  );
}
