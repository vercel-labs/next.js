// Boots `next start`, finds the intercepting-route chunk and requests it with
// fully-encoded, fully-decoded and partially-decoded paths.
import { spawn } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = '.next/static/chunks'
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    statSync(p).isDirectory() ? walk(p, out) : out.push(p)
  }
  return out
}
const chunk = walk(root).find((p) => p.includes('@modal') && p.includes('[id]'))
if (!chunk) {
  console.error(
    'No nested chunk path found. Did you build with `next build --webpack`? ' +
      'Turbopack builds emit flat hashed chunk names and are not affected.'
  )
  process.exit(1)
}
const rel = relative(root, chunk).split('\\').join('/')
console.log('chunk:', rel)

const server = spawn('npx', ['next', 'start', '-p', '3000'], {
  stdio: ['ignore', 'inherit', 'inherit'],
})
const base = 'http://localhost:3000/_next/static/chunks/'
const cases = {
  'fully encoded': rel.replace('@', '%40').replace('[', '%5B').replace(']', '%5D'),
  'fully decoded': rel,
  'partially decoded (@ raw, brackets encoded)': rel
    .replace('[', '%5B')
    .replace(']', '%5D'),
}
await new Promise((r) => setTimeout(r, 5000))
let failed = false
for (const [name, path] of Object.entries(cases)) {
  const res = await fetch(base + path, { method: 'HEAD' })
  console.log(res.status, name, '->', path)
  if (name.startsWith('partially') && res.status === 404) failed = true
}
server.kill()
console.log(
  failed
    ? '\nBUG REPRODUCED: partially decoded chunk URL returns 404'
    : '\nno 404: not reproduced'
)
process.exit(failed ? 1 : 0)
