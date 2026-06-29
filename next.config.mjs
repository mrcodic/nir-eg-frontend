import path from "path";
import { v4 as uuidv4 } from "uuid";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.hq.nir-edu.com",
      },
      {
        protocol: "https",
        hostname: "*.admin.nir-edu.com",
      },
      {
        protocol: "https",
        hostname: "*.dev.nir-edu.com",
      },
      {
        protocol: "https",
        hostname: "*.nir-edu.com",
      },
      {
        protocol: "https",
        hostname: "cdn03.vdocipher.com",
      },
    ],
  },
  generateBuildId: async () => {
    return uuidv4();
  },
};

export default nextConfig;
