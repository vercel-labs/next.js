// Greps the production client chunks that the HTML actually loads (module, not nomodule)
// for next-polyfill-module code. Run after `npm run build`.
import { readdirSync, readFileSync } from 'node:fs'
const dir = '.next/static/chunks'
const needles = [
  'trimStart',
  'Array.prototype.flat',
  'Object.fromEntries',
  'Promise.prototype.finally',
  'Object.hasOwn',
  'Array.prototype.at',
  'canParse',
]
for (const f of readdirSync(dir)) {
  if (!f.endsWith('.js') || f.startsWith('polyfills-')) continue
  const src = readFileSync(`${dir}/${f}`, 'utf8')
  const hits = needles.filter((n) => src.includes(n))
  if (hits.length > 2) console.log(`${f}: ${hits.join(', ')}`)
}
