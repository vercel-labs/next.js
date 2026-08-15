import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Removing either of these flags makes the bug disappear.
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
