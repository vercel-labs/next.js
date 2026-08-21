/** @type {import('next').NextConfig} */
export default {
  turbopack: {
    rules: {
      // `condition.query` (Turbopack, added in Next.js 16.2 via PR #88644)
      // matches the import's resource query. Without it, `import './x.txt?raw'`
      // fails with "Unknown module type".
      '*.txt': [
        // 1. webpack-loader based
        { condition: { query: '?raw' }, loaders: ['raw-loader'], as: '*.js' },
        // 2. loader-free equivalent via module type
        { condition: { query: /[?&]text(?=&|$)/ }, type: 'text' },
      ],
    },
  },
  // Webpack equivalent, for comparison: also requires explicit configuration.
  webpack(config) {
    config.module.rules.push({ resourceQuery: /^\?raw$/, type: 'asset/source' })
    config.module.rules.push({ resourceQuery: /^\?text$/, type: 'asset/source' })
    return config
  },
}
