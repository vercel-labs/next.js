/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (process.env.NO_REWRITE === '1') return []
    return [
      {
        source: '/:locale/:vacancy/:id',
        destination: '/:locale/vacancy/:id',
      },
    ]
  },
}
export default nextConfig
