import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Unrelated next@16-canary bug: the generated route validator treats
    // app/product/sitemap.ts as a RouteHandler and fails type checking.
    ignoreBuildErrors: true,
  },
}

export default nextConfig
