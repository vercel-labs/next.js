import type { NextConfig } from "next";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const nextConfig: NextConfig = {
  experimental: {
    swcPlugins: [
      [
        "noop-swc",
        {
          // This is a placeholder for the noop-swc plugin configuration
          // It can be customized as needed
          basePath: join(__dirname, "src"),
        },
      ],
    ],
  },
};


export default nextConfig;