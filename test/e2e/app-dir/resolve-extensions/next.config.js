// .web.tsx/.web.js intentionally placed before .tsx/.js to verify
// resolveExtensions priority
const extensions = [
  '',
  '.png',
  '.web.tsx',
  '.tsx',
  '.ts',
  '.jsx',
  '.web.js',
  '.js',
  '.json',
]

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  turbopack: {
    resolveExtensions: [...extensions],
  },
  webpack(config) {
    config.resolve.extensions = [...extensions]
    return config
  },
}

module.exports = nextConfig
