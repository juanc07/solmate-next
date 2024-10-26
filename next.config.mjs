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
  };
  
  export default nextConfig;
  