import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ['nanoid'],

}
export default nextConfig
