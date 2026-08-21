// Copies vendor/router-wrapper into node_modules as a *real* directory so that
// webpack treats it as an external node_modules package in the server build.
// (A `file:` dependency would be symlinked and therefore bundled instead.)
const fs = require('fs')
const path = require('path')
const src = path.join(__dirname, 'vendor', 'router-wrapper')
const dest = path.join(__dirname, 'node_modules', 'router-wrapper')
fs.rmSync(dest, { recursive: true, force: true })
fs.cpSync(src, dest, { recursive: true })
console.log('copied router-wrapper into node_modules')
