// Simulates what pnpm/yarn do on Windows: top-level node_modules entries are
// junctions, whose readlink() target is an ABSOLUTE path. On Linux/macOS the
// same package managers create RELATIVE symlinks, which is why this bug is
// Windows-only. Run this before `next build` to reproduce on any platform.
import fs from 'node:fs'
import path from 'node:path'

const nm = path.resolve('node_modules')
let changed = 0
for (const name of fs.readdirSync(nm)) {
  const p = path.join(nm, name)
  let target
  try {
    target = fs.readlinkSync(p)
  } catch {
    continue
  }
  if (path.isAbsolute(target)) continue
  const abs = path.resolve(nm, target)
  fs.unlinkSync(p)
  fs.symlinkSync(abs, p)
  changed++
  console.log(`${name} -> ${abs}`)
}
console.log(`made ${changed} node_modules link(s) absolute (Windows junction behavior)`)
