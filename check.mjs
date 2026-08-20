import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = '.next/static/chunks'
const files = []
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name)
    e.isDirectory() ? walk(p) : p.endsWith('.js') && files.push(p)
  }
}
walk(dir)
let bad = 0
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  const hits = []
  if (/\?\./.test(src)) hits.push('optional chaining ?.')
  if (/\?\?/.test(src)) hits.push('nullish coalescing ??')
  if (hits.length) {
    bad++
    console.log(`${f}: ${hits.join(', ')}`)
  }
}
console.log(bad ? `\nFAIL: ${bad}/${files.length} client chunks contain ES2020+ syntax` : `\nOK: no ES2020+ syntax in ${files.length} chunks`)
process.exit(bad ? 1 : 0)
