import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Configure function timeouts for Vercel
  serverRuntimeConfig: {
    maxDuration: 30,
  },
};

export default nextConfig;
