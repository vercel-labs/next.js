/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@repro/shared'],
  experimental: {
    optimizePackageImports: ['@repro/shared'],
  },
}
