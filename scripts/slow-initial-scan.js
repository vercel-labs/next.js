// Deterministically models a temporary I/O stall during Watchpack's initial
// scan. It changes timing only: readdir results are captured immediately and
// delivered after five seconds while Next's event loop remains responsive.
const fs = require('fs')
const readdir = fs.readdir
const releaseAt = Date.now() + 5000

fs.readdir = function (directory, ...args) {
  const callback = typeof args.at(-1) === 'function' ? args.at(-1) : null
  if (!callback || !/\/pages\/(api|p)$/.test(String(directory))) {
    return readdir.call(this, directory, ...args)
  }

  args[args.length - 1] = (...result) => {
    const delay = Math.max(0, releaseAt - Date.now())
    console.error('[SLOW-INITIAL-SCAN]', directory, `${delay}ms`)
    setTimeout(() => callback(...result), delay)
  }
  return readdir.call(this, directory, ...args)
}
