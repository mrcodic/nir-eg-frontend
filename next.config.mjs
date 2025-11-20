/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "dev.more-english.net",
      "admin.more-english.net",
      "cdn03.vdocipher.com",
      "https://dev.more-english.net",
      "https://admin.more-english.net",
      "www.youtube.com",
      "https://cdn03.vdocipher.com",
    ],
  },
};

export default nextConfig;
