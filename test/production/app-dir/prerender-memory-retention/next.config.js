/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  cacheComponents: true,
  experimental: {
    // Pin static generation to a single worker so that the heap samples that
    // the fixture logs all come from the same process.
    cpus: 1,
  },
}

module.exports = nextConfig
