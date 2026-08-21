module.exports = {
  async rewrites() {
    return [
      { source: '/hunder/:code', destination: '/dogs/:code' },
      { source: '/hunder', destination: '/dogs' },
    ]
  },
}
