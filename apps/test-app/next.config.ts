import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@opentelemetry/instrumentation'],
}

export default nextConfig
