import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Set PARTIAL_PREFETCHING=0 to build the control (no duplication).
  partialPrefetching: process.env.PARTIAL_PREFETCHING !== '0',
}

export default nextConfig
