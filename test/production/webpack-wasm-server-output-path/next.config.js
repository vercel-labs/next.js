module.exports = {
  webpack(config) {
    // WebAssembly imports are opt-in, this is the configuration users are
    // pointed at in https://github.com/vercel/next.js/issues/29362
    config.experiments = { ...config.experiments, asyncWebAssembly: true }
    return config
  },
}
