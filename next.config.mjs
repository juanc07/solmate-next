/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'kxcwdvamhswehrqbpdfc.supabase.co',  // Replace with your Supabase domain
          pathname: '/**',  // Match all paths
        },
      ],
    },
    env: {
      NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
      NEXT_PUBLIC_SOLANA_ENV: process.env.NEXT_PUBLIC_SOLANA_ENV || 'devnet',
      NEXT_PUBLIC_DEBUG_ON: process.env.NEXT_PUBLIC_DEBUG_ON || false
    },
  };
  
  export default nextConfig;
  