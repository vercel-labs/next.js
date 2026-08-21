import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typedRoutes: true,
  async redirects() {
    return [
      { source: '/c:id', destination: '/dashboard/customers/:id', permanent: true },
      { source: '/a/m:id', destination: '/dashboard/products/:id', permanent: true },
      { source: '/ok/:id', destination: '/dashboard/products/:id', permanent: true },
    ]
  },
}

export default nextConfig
