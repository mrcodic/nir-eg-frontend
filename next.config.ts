import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev.nir-edu.com",
      },
    ],
  },
};

export default nextConfig;
