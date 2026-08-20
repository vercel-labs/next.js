// Greps the client chunks for identifiers that only exist in the
// react-dom profiling build (react-dom/profiling), never in the
// plain production build.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(process.cwd(), '.next/static/chunks')
let hits = 0
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith('.js')) {
      const s = readFileSync(p, 'utf8')
      hits += (s.match(/treeBaseDuration/g) || []).length
    }
  }
}
walk(dir)
console.log(
  hits > 0
    ? `PASS: profiling build bundled (treeBaseDuration hits: ${hits})`
    : 'FAIL: react-dom profiling build was NOT bundled (0 treeBaseDuration hits)'
)
process.exit(hits > 0 ? 0 : 1)
