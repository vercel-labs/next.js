import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Global default: images are NOT optimized
    unoptimized: true,
  },
}

export default nextConfig
