/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', // If testing locally
        port: '3000', // Your local dev port
        pathname: '/api/proxy-image',
      },
      {
        protocol: 'https',
        hostname: 'solmate-next.vercel.app/', // Your deployed domain
        pathname: '/api/proxy-image',
      },
      {
        protocol: 'https',
        hostname: 'kxcwdvamhswehrqbpdfc.supabase.co',  // Your Supabase domain
        pathname: '/**',  // Allow all paths
      },
    ],
  },
  env: {    
    NEXT_PUBLIC_SOLANA_ENV: process.env.NEXT_PUBLIC_SOLANA_ENV || 'mainnet-beta',
    NEXT_PUBLIC_DEBUG_ON: process.env.NEXT_PUBLIC_DEBUG_ON || 'false',
  },
};

export default nextConfig;
