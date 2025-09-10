import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  devIndicators: false,
  images: { 
    remotePatterns: [
      { 
        protocol: "https",
        hostname: "vqmvnimrzrzhuoqeggoo.supabase.co",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
