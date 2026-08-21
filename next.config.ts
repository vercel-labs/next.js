import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  reactMaxHeadersLength: 100_000_000,
};

export default nextConfig;
