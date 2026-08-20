module.exports = {
  async rewrites() {
    return [
      { source: '/image/:url*', destination: '/api/image?url=:url*' },
    ]
  },
}
