// Read-only instrumentation: expose React's dev-only `pendingOperations` map
// (inside next/dist/compiled/next-server/app-page-turbo.runtime.dev.js) on
// globalThis so a route handler can report its size. Optionally install a hard
// entry cap so the 2^24 V8 Map limit can be hit in minutes instead of hours.
const fs = require('fs')
const path = require('path')

const CAP = process.env.CAP ? Number(process.env.CAP) : 0
const files = [
  'node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js',
]

for (const rel of files) {
  const file = path.join(__dirname, rel)
  if (!fs.existsSync(file + '.orig')) fs.copyFileSync(file, file + '.orig')
  let src = fs.readFileSync(file + '.orig', 'utf8')

  const decl = 'pendingOperations=new Map'
  if (!src.includes(decl)) throw new Error('decl not found in ' + rel)
  const replacement = CAP
    ? `pendingOperations=(globalThis.__nextPendingOperations=new (class extends Map{set(k,v){if(this.size>=${CAP})throw new RangeError("Map maximum size exceeded");return super.set(k,v)}}))`
    : 'pendingOperations=(globalThis.__nextPendingOperations=new Map)'
  src = src.replace(decl, replacement)
  fs.writeFileSync(file, src)
  console.log('instrumented', rel, CAP ? `(cap=${CAP})` : '(observe only)')
}
