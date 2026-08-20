const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: process.env.MDX_RS === '1',
  },
})
