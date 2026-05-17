/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
  logging: {
    fetches: true,
  },
};

export default nextConfig;
