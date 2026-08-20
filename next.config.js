// A custom `webpack` function is required to trigger the bug.
// (Adding infrastructureLogging only makes the underlying EACCES visible.)
module.exports = {
  webpack: (config) => {
    config.infrastructureLogging = {
      debug: /PackFileCacheStrategy/,
      level: 'verbose',
    }
    return config
  },
}
