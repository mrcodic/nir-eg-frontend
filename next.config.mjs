/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "dev.nir-edu.com",
      "admin.nir-edu.com",
      "admin.hq.nir-edu.com",
      "cdn03.vdocipher.com",
      "www.youtube.com",
      "https://cdn03.vdocipher.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
