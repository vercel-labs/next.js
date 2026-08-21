import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    // Legacy Sass API option: ignored by Next 16 (sass-loader v16 / modern API).
    // Swap to `loadPaths` and the build succeeds.
    includePaths: [path.join(__dirname, "assets/styles")],
    additionalData: `@use "variables" as *;`,
  },
};

export default nextConfig;
