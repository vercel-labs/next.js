import type { NextConfig } from 'next'

// REPRO=broken includes the two `page.broken.tsx` routes that fail `next build`
// when the build environment has no database access.
const includeBroken = process.env.REPRO === 'broken'

const nextConfig: NextConfig = {
  cacheComponents: true,
  pageExtensions: includeBroken
    ? ['broken.tsx', 'tsx', 'ts']
    : ['tsx', 'ts'],
}

export default nextConfig
