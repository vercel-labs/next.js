// Reproduction for vercel/next.js#83459
// Next.js ships a vendored copy of cross-spawn@7.0.3 (CVE-2024-21538 / GHSA-3xgq-45jj-v275)
// in packages/next/dist/compiled/cross-spawn. Verifies the pin, the unpatched regex, and the
// quadratic blowup that the 7.0.5 fix removes.
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const nextPkg = require('next/package.json')
const compiled = require.resolve('next/dist/compiled/cross-spawn/index.js')
const src = readFileSync(compiled, 'utf8')
const compiledPkg = JSON.parse(
  readFileSync(compiled.replace(/index\.js$/, 'package.json'), 'utf8')
)

console.log('next version:                ', nextPkg.version)
console.log('pin in next/package.json:     cross-spawn@' + (nextPkg.devDependencies?.['cross-spawn'] ?? nextPkg.dependencies?.['cross-spawn'] ?? '(absent)'))
console.log('compiled package.json:       ', JSON.stringify(compiledPkg))
console.log('compiled file:               ', compiled.slice(compiled.indexOf('node_modules')))

const vulnerable = src.includes(String.raw`replace(/(\\*)"/g`)
const patched = src.includes(String.raw`(?=(\\+?)?)`)
console.log('contains pre-7.0.5 regex:    ', vulnerable)
console.log('contains 7.0.5 fixed regex:  ', patched)

// escapeArgument from cross-spawn 7.0.3 (as bundled) vs 7.0.5 (fixed)
const v303 = (a) => `"${String(a).replace(/(\\*)"/g, '$1$1\\"').replace(/(\\*)$/, '$1$1')}"`
const v305 = (a) => `"${String(a).replace(/(?=(\\+?)?)\1"/g, '$1$1\\"').replace(/(?=(\\+?)?)\1$/, '$1$1')}"`

console.log('\nReDoS timing (escapeArgument on N backslashes):')
for (const n of [5000, 10000, 20000, 40000]) {
  const s = '\\'.repeat(n)
  const row = []
  for (const [name, fn] of [['vendored 7.0.3', v303], ['fixed 7.0.5', v305]]) {
    const t = process.hrtime.bigint()
    fn(s)
    row.push(`${name}: ${(Number(process.hrtime.bigint() - t) / 1e6).toFixed(1)}ms`)
  }
  console.log(`  n=${String(n).padStart(6)}  ${row.join('   ')}`)
}

const res = await fetch('https://api.osv.dev/v1/query', {
  method: 'POST',
  body: JSON.stringify({ package: { name: 'cross-spawn', ecosystem: 'npm' }, version: '7.0.3' }),
}).then((r) => r.json()).catch(() => null)
if (res?.vulns) {
  console.log('\nOSV advisories for cross-spawn@7.0.3:',
    res.vulns.map((v) => `${v.id} (${(v.aliases ?? []).join(',')})`).join(', '))
}

if (!vulnerable || patched) {
  console.log('\nNOT REPRODUCED: bundled cross-spawn no longer matches 7.0.3 sources.')
  process.exit(1)
}
console.log('\nREPRODUCED: next ships unpatched cross-spawn 7.0.3 code in dist/compiled.')
