import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep the repro focused on module resolution, not types
  typescript: { ignoreBuildErrors: true },
  turbopack: {
    resolveAlias: {
      // control: an arbitrary specifier -> works
      "aliased-link": "./src/components/Link.tsx",
      // bug: ignored, built-in next/link is still used
      "next/link": "./src/components/Link.tsx",
      "original-next-link": "./node_modules/next/link.js",
    },
  },
};

export default nextConfig;
