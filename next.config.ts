import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Both flags are top-level in Next 16.3.
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
