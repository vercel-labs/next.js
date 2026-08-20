import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const dir = '.next/static/chunks'
const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]
  )

let any = false
for (const f of walk(dir).filter((f) => f.endsWith('.js'))) {
  const src = readFileSync(f, 'utf8')
  const m = src.match(/data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]+/g)
  if (!m) continue
  any = true
  const bytes = m.reduce((a, d) => a + d.length, 0)
  const size = statSync(f).size
  console.log(
    `${f}: ${size} B total, ${m.length} inlined base64 image data URL(s) = ${bytes} B (${(
      (bytes / size) *
      100
    ).toFixed(1)}% of the chunk)`
  )
}
if (!any) console.log('No inlined base64 image data URL found in client chunks')
