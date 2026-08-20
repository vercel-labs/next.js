const BLOG_URL = process.env.BLOG_URL || 'http://localhost:4000'

module.exports = {
  async rewrites() {
    return [
      { source: '/blog', destination: `${BLOG_URL}/blog` },
      { source: '/blog/:path*', destination: `${BLOG_URL}/blog/:path*` },
    ]
  },
}
