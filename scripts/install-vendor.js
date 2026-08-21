// Copies vendor/external-image-pkg into node_modules as a *real* directory
// (a `file:` dependency would be symlinked into the project and therefore
// bundled by Turbopack/webpack, which hides the bug).
const fs = require('fs')
const path = require('path')
const from = path.join(__dirname, '..', 'vendor', 'external-image-pkg')
const to = path.join(__dirname, '..', 'node_modules', 'external-image-pkg')
fs.rmSync(to, { recursive: true, force: true })
fs.cpSync(from, to, { recursive: true })
console.log('[repro] installed external-image-pkg into node_modules')
