/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kxcwdvamhswehrqbpdfc.supabase.co',  // Your Supabase domain
        pathname: '/**',  // Allow all paths
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',  // Allow GitHub-hosted images
        pathname: '/**',  // Token images path
      },
      {
        protocol: "https",
        hostname: "**.nftstorage.link",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'images.cdn.aurory.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gateway.irys.xyz',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'quicknode.quicknode-ipfs.com',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_DEBUG_ON: process.env.NEXT_PUBLIC_DEBUG_ON || 'false',
  },
};

export default nextConfig;
