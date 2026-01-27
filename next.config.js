/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medbridge-portal.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
