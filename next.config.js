const CopyPlugin = require('copy-webpack-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            // any file shipped inside node_modules
            from: 'node_modules/copy-webpack-plugin/package.json',
            to: 'public/copied/',
          },
        ],
      })
    )
    return config
  },
}
