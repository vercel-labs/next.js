// Amplifies the race window of the unawaited `requestData.body.finalize()` call in
// next-server.js (Node.js proxy/middleware) by making `finalize()` resolve one
// macrotask later. Same technique the upstream regression test for #85418 uses.
import fs from 'node:fs'

const file = process.argv[2]
const src = fs.readFileSync(file, 'utf8')
const needle = '*/ async finalize () {'
if (!src.includes(needle)) throw new Error('finalize() not found in ' + file)
if (src.includes('FINALIZE_DELAY_MS')) {
  console.log('already patched:', file)
  process.exit(0)
}
fs.writeFileSync(
  file,
  src.replace(
    needle,
    needle +
      '\n            await new Promise((r) => setTimeout(r, Number(process.env.FINALIZE_DELAY_MS || 0)));'
  )
)
console.log('patched:', file)
