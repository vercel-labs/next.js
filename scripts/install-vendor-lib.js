// Copies vendor/fake-lib into node_modules/fake-lib so the CSS import happens
// from a real (non-symlinked) node_modules package, like a published npm package.
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'vendor', 'fake-lib');
const dest = path.join(__dirname, '..', 'node_modules', 'fake-lib');
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log('copied vendor/fake-lib -> node_modules/fake-lib');
