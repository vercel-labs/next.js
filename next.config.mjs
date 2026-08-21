/** @type {import('next').NextConfig} */
const nextConfig = {
  // Invalid outputFileTracingRoot: relative path (and one that resolves inside
  // the project). Also try "not-an-absolute-path" (a path that does not exist).
  outputFileTracingRoot: "app",
};

export default nextConfig;
