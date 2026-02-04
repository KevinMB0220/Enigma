/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
