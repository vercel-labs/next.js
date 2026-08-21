import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  pageExtensions: ["page.tsx", "server.ts"],
};

export default nextConfig;
