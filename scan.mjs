// Scans built client chunks for duplicated compiled helpers described in
// https://github.com/vercel/next.js/issues/37142
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = '.next/static/chunks'
const files = []
;(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e)
    statSync(p).isDirectory() ? walk(p) : p.endsWith('.js') && files.push(p)
  }
})(root)

const patterns = {
  'class helper (Cannot call a class as a function)': /Cannot call a class as a function/g,
  'inherits helper (Super expression must either be null)': /Super expression must either be null/g,
  'destructuring helper (Invalid attempt to destructure)': /Invalid attempt to destructure non-iterable/g,
  'spread helper (Invalid attempt to spread)': /Invalid attempt to spread non-iterable/g,
  'cjs default-export interop epilogue':
    /\("function"==typeof [a-zA-Z_$]+\.default.{0,300}?exports=[a-zA-Z_$]+\.default/gs,
  'namespace import interop loop': /hasOwnProperty\.call/g,
}

for (const [name, re] of Object.entries(patterns)) {
  let count = 0,
    bytes = 0,
    hit = 0
  for (const f of files) {
    const m = readFileSync(f, 'utf8').match(re)
    if (m) {
      hit++
      count += m.length
      bytes += m.reduce((a, s) => a + s.length, 0)
    }
  }
  console.log(
    `${String(count).padStart(4)} copies in ${hit} file(s), ${bytes} bytes  <-  ${name}`
  )
}
