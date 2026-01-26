import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: { inlineCss: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.nir-edu.com",
      },
    ],
  },
};

export default nextConfig;
