/**
 * Repro for https://github.com/vercel/next.js/issues/78592
 *
 * WASM_MODE=as-js       (default) file-loader with `as: '*.js'` (maintainer suggestion in the issue)
 * WASM_MODE=no-as       file-loader without `as` (config from the original report)
 * WASM_MODE=asset-type  Turbopack built-in `rules.*.type: 'asset'`
 *
 * @type {import('next').NextConfig}
 */
const mode = process.env.WASM_MODE || 'as-js'
console.log('[repro] WASM_MODE =', mode)

const fileLoaderRule = {
  loaders: [{ loader: 'file-loader', options: { esModule: true } }],
  ...(mode === 'as-js' ? { as: '*.js' } : {}),
}

module.exports = {
  turbopack: {
    rules: {
      '*.wasm': mode === 'asset-type' ? { type: 'asset' } : fileLoaderRule,
    },
  },
  webpack(config) {
    config.module.rules.push({ test: /\.wasm/, loader: 'file-loader', options: {} })
    return config
  },
}
