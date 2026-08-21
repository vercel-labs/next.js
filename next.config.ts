import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    // comment out the rule below and the CSS url() is rewritten correctly
    rules: {
      '*.svg': {
        type: 'asset',
      },
    },
  },
}

export default nextConfig
