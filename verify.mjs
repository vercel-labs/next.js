// Lists the opengraph-image responses that Next.js actually prerendered at build time.
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = '.next/server/app'
const found = []
;(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (p.endsWith('.body')) found.push(p)
  }
})(root)

console.log('prerendered image bodies in .next/server/app:')
for (const f of found.sort()) console.log('  ' + f)
if (!found.length) console.log('  (none)')
