import type { NextConfig } from "next";

// Simulates the Tauri v2 Android dev setup from the issue: the dev server
// listens on 0.0.0.0 and assets are served from a LAN host, while the
// WebView/browser loads the page from a *different* origin (or sends
// `Origin: null`).
const internalHost = process.env.TAURI_DEV_HOST || "localhost";
const port = process.env.PORT || "3000";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  assetPrefix: `http://${internalHost}:${port}`,
  // Uncomment to work around the regression:
  // allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
