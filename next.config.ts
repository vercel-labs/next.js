import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The app that surfaced this runs with Cache Components on, so the repro keeps it
  // on to match. The failure itself is a transport-level property of the HTTP/1.1
  // connection pool and does not depend on this flag — it is enabled only to mirror
  // the original environment. (Cache Components currently requires Turbopack.)
  cacheComponents: true,
};

export default nextConfig;
