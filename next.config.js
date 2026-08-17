/** @type {import('next').NextConfig} */
const config = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // keeps the package external so the standalone file tracer has to copy it
  serverExternalPackages: ["@libsql/isomorphic-ws"],
  // Test A: this include IS honored by Turbopack (bug 1 does not reproduce)
  outputFileTracingIncludes: {
    "/*": ["./extra-assets/**/*"],
    // Test C: a route-key for the instrumentation hook is never matched
    "/instrumentation": ["./instrumentation-only-assets/**/*"],
  },
};
module.exports = config;
