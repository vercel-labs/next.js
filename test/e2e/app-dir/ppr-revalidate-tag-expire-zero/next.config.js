/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  cacheComponents: true,
  cacheLife: {
    hours: { stale: 300, revalidate: 3600, expire: 86400 },
  },
}

module.exports = nextConfig
