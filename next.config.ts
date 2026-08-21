import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // wide device sizes so that each viewport width produces a distinct,
    // expensive optimization (same as the original report)
    deviceSizes: Array(25)
      .fill(null)
      .map((_, i) => 4070 + i),
  },
}

export default nextConfig
