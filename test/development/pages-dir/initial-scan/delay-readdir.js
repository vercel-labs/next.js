const fs = require('fs')
const path = require('path')
const originalReaddir = fs.readdir
let delayed = false

fs.readdir = function (directory, ...args) {
  const callback = args.at(-1)
  const parent = path.dirname(String(directory))
  if (
    delayed ||
    typeof callback !== 'function' ||
    path.basename(String(directory)) !== 'api' ||
    path.basename(parent) !== 'pages'
  ) {
    return originalReaddir.call(this, directory, ...args)
  }

  // Model an asynchronous I/O stall while Watchpack's initial scan continues.
  delayed = true
  args[args.length - 1] = (...result) => {
    setTimeout(() => callback(...result), 3000)
  }
  return originalReaddir.call(this, directory, ...args)
}
