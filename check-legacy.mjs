// Verifies Lighthouse's `legacy-javascript` signals exist in the shipped bundle.
import { readdirSync, readFileSync } from 'node:fs'
const dir = '.next/static/chunks'
const signals = [
  'String.prototype.trimStart',
  'String.prototype.trimEnd',
  'Array.prototype.flat',
  'Array.prototype.flatMap',
  'Array.prototype.at',
  'Object.fromEntries',
  'Object.hasOwn',
]
let found = false
for (const f of readdirSync(dir).filter((f) => f.endsWith('.js'))) {
  const code = readFileSync(`${dir}/${f}`, 'utf8')
  const hits = signals.filter((s) => code.includes(s.split('.').pop() + ''))
  if (code.includes('trimStart') && code.includes('flatMap')) {
    found = true
    console.log(`polyfills shipped in ${dir}/${f}: ${hits.join(', ')}`)
  }
}
console.log(found ? 'FAIL: legacy polyfills present despite modern browserslist' : 'PASS: no polyfills')
process.exit(found ? 1 : 0)
