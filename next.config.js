const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = (phase, { defaultConfig }) => ({
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: 'export',
})

module.exports = withMDX(nextConfig)
