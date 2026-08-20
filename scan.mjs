// Parses every <script src> served by a running Next.js server at ES2019
// (the newest ECMAScript level Safari 12 / iOS 12 fully supports).
import * as acorn from 'acorn'

const base = process.argv[2] || 'http://localhost:3010'
const path = process.argv[3] || '/'
const html = await (await fetch(base + path)).text()
const srcs = [...html.matchAll(/src="([^"]+\.js[^"]*)"/g)].map((m) => m[1])
if (srcs.length === 0) throw new Error('no scripts found in HTML')

let failures = 0
for (const src of [...new Set(srcs)]) {
  const url = src.startsWith('http') ? src : base + src
  const code = await (await fetch(url)).text()
  try {
    acorn.parse(code, { ecmaVersion: 2019, sourceType: 'script' })
    console.log('ok   ES2019  ' + src)
  } catch (err) {
    failures++
    const at = code.slice(Math.max(0, err.pos - 60), err.pos + 60).replace(/\n/g, ' ')
    console.log('FAIL ES2019  ' + src)
    console.log('     ' + err.message)
    console.log('     ...' + at + '...')
  }
}
console.log(`\n${failures} of ${new Set(srcs).size} scripts use syntax newer than ES2019`)
process.exit(failures ? 1 : 0)
