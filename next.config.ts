import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Both are required to see the leak:
  //  - cacheComponents: enables the `use cache` machinery whose per-render abort Error is retained
  //  - output: standalone: how the app is deployed (matches a Docker/k8s deploy)
  cacheComponents: true,
  output: 'standalone',
};

export default nextConfig;
