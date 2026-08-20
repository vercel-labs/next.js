/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  async rewrites() {
    return [
      { source: '/', destination: '/home/' },
      { source: '/test/', destination: '/test/1/' },
      { source: '/no-slash', destination: '/test/2/' },
    ]
  },
}
