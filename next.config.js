const path = require('path')

module.exports = {
  output: 'standalone',
  // On GitHub `windows-latest` the checkout lives on D:\a\... while the user
  // profile lives on C:\Users\runneradmin. `path.win32.relative()` between two
  // different drives returns an *absolute* path, so nft's only out-of-base
  // guard (`relative(job.base, glob).startsWith('..' + sep)`) is false and the
  // emitted glob is walked. On a single-drive POSIX box that guard holds, so we
  // reproduce the same condition by putting the traced project and the fake
  // user profile under one common tracing root (see repro.sh).
  outputFileTracingRoot: path.join(__dirname, '..'),
}
