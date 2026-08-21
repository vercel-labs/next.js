import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['tsx', 'ts', 'universal.ts', 'universal.tsx'],
}

module.exports = nextConfig
