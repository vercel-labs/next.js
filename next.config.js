/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // renamed to `experimental.cacheComponents` in later canaries
    dynamicIO: true,
  },
};

module.exports = nextConfig;
