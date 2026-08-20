/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    console.log('Custom Webpack config is being applied')
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf)(\?[a-z0-9=.]+)?$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext][query]',
      },
    })
    return config
  },
}
