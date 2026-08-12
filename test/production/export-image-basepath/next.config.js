/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  basePath: '/bug',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
