/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  cacheComponents: true,
  experimental: {
    optimisticRouting: true,
    varyParams: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        // The URL /team is rewritten to /en/team. The client never sees
        // this: to the router, /team looks like a one-part URL that could
        // be matched by the learned /[locale] pattern.
        { source: '/team', destination: '/en/team' },
      ],
    }
  },
}

module.exports = nextConfig
