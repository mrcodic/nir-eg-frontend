/** @type {import('next').NextConfig} */
const nextConfig = {
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
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
