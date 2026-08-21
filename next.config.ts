import type { NextConfig } from 'next'

const nextConfig = {
  webpack: (config) => {
    config.devtool = 'source-map'
    return config
  },
} satisfies NextConfig

export default nextConfig
