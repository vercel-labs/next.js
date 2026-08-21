import createMDX from '@next/mdx'
import { createRequire } from 'node:module'
const req = createRequire(import.meta.url)
const loaderPath = req.resolve('@next/mdx/mdx-js-loader')
const withMDX = createMDX({ extension: /\.mdx?$/ })
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  webpack(config) {
    config.plugins.push({
      apply(compiler) {
        compiler.hooks.done.tap('evict-mdx-loader', () => {
          delete req.cache[loaderPath]
        })
      },
    })
    return config
  },
}
export default withMDX(nextConfig)
