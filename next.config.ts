import type { NextConfig } from 'next'
import type { Config as SVGRConfig } from '@svgr/core'

const svgrLoaderOptions: SVGRConfig = {
  ref: true,
  titleProp: true,
  svgProps: { focusable: 'false' },
}

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        // TS2322: Type 'Config' is not assignable to type 'TurbopackLoaderOptions'.
        loaders: [{ loader: '@svgr/webpack', options: svgrLoaderOptions }],
        as: '*.js',
      },
    },
  },
}

export default nextConfig
