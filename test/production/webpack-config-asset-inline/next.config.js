module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /inline/,
      type: 'asset/inline',
    })
    return config
  },
}
