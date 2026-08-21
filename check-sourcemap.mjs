// Verifies that minified identifiers in the built server chunk carry their
// original names in the generated source map (`names` field of the mapping).
import fs from 'node:fs'
import path from 'node:path'
import { SourceMapConsumer } from 'source-map'

const dir = '.next/server/app'
const js = path.join(dir, 'page.js')
const map = js + '.map'
if (!fs.existsSync(map)) throw new Error('missing ' + map)

const code = fs.readFileSync(js, 'utf8')
const consumer = await new SourceMapConsumer(
  JSON.parse(fs.readFileSync(map, 'utf8'))
)

// find the minified `.map((X) => ...)` callback parameter emitted for app/page.tsx
const lines = code.split('\n')
let hit = null
for (let l = 0; l < lines.length && !hit; l++) {
  const re = /products\.map\(|\.map\(\s*\(?([A-Za-z_$][\w$]*)\)?\s*=>/g
  let m
  while ((m = re.exec(lines[l]))) {
    if (!m[1]) continue
    const ident = m[1]
    const column = m.index + m[0].indexOf(ident)
    const orig = consumer.originalPositionFor({ line: l + 1, column })
    if (orig.source && /app\/page\.tsx/.test(orig.source)) {
      hit = { ident, line: l + 1, column, orig }
      break
    }
  }
}
consumer.destroy()

if (!hit) {
  console.log('could not locate the minified callback parameter; inspect', js)
  process.exit(2)
}

console.log('generated identifier :', JSON.stringify(hit.ident))
console.log('generated position   : line %d, column %d', hit.line, hit.column)
console.log('mapped source        :', hit.orig.source)
console.log(
  'mapped orig position : line %s, column %s',
  hit.orig.line,
  hit.orig.column
)
console.log('mapped name          :', JSON.stringify(hit.orig.name))

const src = fs
  .readFileSync(path.join('.next/server/app', '..', '..', '..', 'app/page.tsx'), 'utf8')
  .split('\n')[hit.orig.line - 1]
console.log('original source line :', JSON.stringify(src))
console.log(
  'original text at col :',
  JSON.stringify(src.slice(hit.orig.column, hit.orig.column + 20))
)

if (hit.orig.name === 'product') {
  console.log('\nPASS: minified %s resolves to original name "product"', hit.ident)
} else {
  console.log(
    '\nFAIL: minified %s has no original name (expected "product") -> sourcemap `names` missing',
    hit.ident
  )
  process.exitCode = 1
}
