import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: { inlineCss: true, optimizePackageImports: ["lottie-react"] },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.nir-edu.com",
      },
    ],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
