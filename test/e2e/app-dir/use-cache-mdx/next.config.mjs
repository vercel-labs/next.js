import nextMDX from '@next/mdx'

const withMDX = nextMDX()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  cacheComponents: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
}

export default withMDX(nextConfig)
