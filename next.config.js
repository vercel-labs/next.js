/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * Note: If you set static staleTime to 0, the issue will be resolved.
   */
  // experimental: {
  //   staleTimes: {
  //     dynamic: 0,
  //     static: 0,
  //   },
  // },
};

module.exports = nextConfig;
