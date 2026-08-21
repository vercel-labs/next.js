const { version } = require("./package.json");
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_APP_VER: version,
  },
  reactStrictMode: true,
  webpack: (config, { dev, isServer, webpack }) => {
    if (!isServer) {
      config.output.chunkFilename = dev
        ? "static/chunks/[name]-[hash].js"
        : "static/chunks/[name]-[contenthash].js";
    }
    return config;
  },
  transpilePackages: ["@monorepo/ui"],
  output: "export",
  distDir: ".next",
  images: {
    unoptimized: true,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
module.exports = nextConfig;

