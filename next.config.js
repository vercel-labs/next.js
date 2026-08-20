class ThrowingPlugin {
  apply(compiler) {
    compiler.hooks.watchRun.tap('throwing', () => {
      // any user plugin error thrown in watchRun (here: an undefined global,
      // mirroring the reporter's `spawn` typo) triggers the Next.js crash
      spawn('echo', ['hi'])
    })
  }
}
module.exports = {
  webpack(config) {
    config.plugins.push(new ThrowingPlugin())
    return config
  },
}
