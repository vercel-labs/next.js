import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: false,
    turbopackLocalPostcssConfig: true,
  },
};

export default nextConfig;
