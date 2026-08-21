/** @type {import('next').NextConfig} */
module.exports = {
  turbopack: {
    resolveAlias: { 'react-native': 'react-native-web' },
    resolveExtensions: [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.mjs',
    ],
  },
}
