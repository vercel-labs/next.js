/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    staleTimes: { dynamic: 0 },
    scrollRestoration: true,
    serverComponentsHmrCache: true,
  },
}
export default nextConfig
