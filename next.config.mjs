import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Not related to the issue: keeps the repro build offline-friendly
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}

export default createMDX()(nextConfig)
