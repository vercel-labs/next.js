import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/rewrite",
        destination: process.env.REWRITE_URL ?? "http://0.0.0.0:3000/fail-to-rewrite",
      },
    ];
  },
};

export default nextConfig;
