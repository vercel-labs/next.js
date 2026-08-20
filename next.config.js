/** @type {import('next').NextConfig} */
module.exports = {
  experimental: { typedRoutes: true },
  typedRoutes: true,
  async rewrites() {
    return [
      { source: '/@:username', destination: '/user/:username' },
      { source: '/profile/:username', destination: '/user/:username' },
    ]
  },
}
