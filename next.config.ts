import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["dd-trace"],
};

export default nextConfig;
