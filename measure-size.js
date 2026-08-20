const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const m = JSON.parse(fs.readFileSync('.next/server/middleware-manifest.json', 'utf8'))
const info = m.middleware['/']
const size = (f) => {
  const b = fs.readFileSync(path.join('.next', f))
  return { raw: b.length, gzip: zlib.gzipSync(b, { level: 9 }).length }
}
let counted = { raw: 0, gzip: 0 }
let ignored = { raw: 0, gzip: 0 }
for (const f of info.files) {
  const s = size(f)
  counted.raw += s.raw; counted.gzip += s.gzip
  console.log('counted by build output:', f, s)
}
for (const w of [...(info.wasm || []), ...(info.assets || [])]) {
  const s = size(w.filePath)
  ignored.raw += s.raw; ignored.gzip += s.gzip
  console.log('IGNORED by build output:', w.filePath, s)
}
console.log('\nnext build reports:', (counted.gzip / 1e3).toFixed(1), 'kB gzip')
console.log('actual Edge bundle :', ((counted.gzip + ignored.gzip) / 1e6).toFixed(2), 'MB gzip /',
  ((counted.raw + ignored.raw) / 1e6).toFixed(2), 'MB raw')
