const path = require('path')
const os = require('os')

// A dependency that resolves a plugin path rooted at the user's home directory.
// @vercel/nft's static evaluator resolves os.homedir() to a real path, and the
// unknown `name` becomes a wildcard, so the emitted glob's base is outside the
// project (job.base).
exports.loadPlugin = function loadPlugin(name) {
  return require(path.join(os.homedir(), name))
}
