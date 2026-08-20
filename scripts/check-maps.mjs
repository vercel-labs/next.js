// Decodes the browser source maps produced by `next build` and compares the
// mapping fidelity of two byte-identical sources: one under node_modules/,
// one under src/.
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
function decode(mappings) {
  const out = []
  let s = 0, ol = 0, oc = 0, n = 0
  mappings.split(';').forEach((line, gl) => {
    if (!line) return
    let gc = 0
    for (const seg of line.split(',')) {
      if (!seg) continue
      let i = 0
      const v = []
      while (i < seg.length) {
        let r = 0, sh = 0, cont = 1, d
        do { d = B64.indexOf(seg[i++]); cont = d & 32; r += (d & 31) << sh; sh += 5 } while (cont)
        const neg = r & 1; r >>= 1; v.push(neg ? -r : r)
      }
      gc += v[0]
      if (v.length > 1) {
        s += v[1]; ol += v[2]; oc += v[3]
        out.push({ gl, gc, s, ol, oc, named: v.length > 4 ? ((n += v[4]), true) : false })
      }
    }
  })
  return out
}

async function* maps(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* maps(p)
    else if (e.name.endsWith('.js.map')) yield p
  }
}

function stats(map, segs, needle) {
  const i = map.sources.findIndex((s) => s.includes(needle))
  if (i === -1) return null
  const m = segs.filter((x) => x.s === i)
  if (!m.length) return null
  return {
    source: map.sources[i],
    mappings: m.length,
    columnAccurate: m.filter((x) => x.oc !== 0).length,
    withNames: m.filter((x) => x.named).length,
  }
}

let vendor, src
for await (const file of maps('.next/static/chunks')) {
  const map = JSON.parse(await readFile(file, 'utf8'))
  const segs = decode(map.mappings)
  vendor ??= stats(map, segs, 'node_modules/vendor-lib/index.js')
  src ??= stats(map, segs, 'src/lib.js')
}

console.log('node_modules/vendor-lib/index.js :', vendor)
console.log('src/lib.js                      :', src)

if (!vendor || !src) {
  console.error('\nCould not find both sources in the emitted source maps.')
  process.exit(2)
}
const ok = vendor.withNames > 0 && vendor.mappings >= src.mappings * 0.8
console.log(
  ok
    ? '\nOK: both copies got high fidelity mappings.'
    : `\nBUG: the node_modules copy has ${vendor.mappings} mappings (${vendor.withNames} with names) while the identical src copy has ${src.mappings} (${src.withNames} with names).`
)
process.exit(ok ? 0 : 1)
