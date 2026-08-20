/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      sideEffects: true,
      test: /\.css$/,
      use: isServer ? ['css-loader'] : ['style-loader', 'css-loader'],
    })
    return config
  },
}
