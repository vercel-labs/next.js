import fs from 'node:fs'
import path from 'node:path'

const standalone = path.resolve('.next/standalone')
const nm = path.join(standalone, 'node_modules')
let bad = 0
for (const name of fs.readdirSync(nm)) {
  const link = path.join(nm, name)
  let target
  try {
    target = fs.readlinkSync(link)
  } catch {
    continue
  }
  const resolved = path.resolve(path.dirname(link), target)
  const inside = resolved.startsWith(standalone + path.sep)
  console.log(`${inside ? 'OK  ' : 'BAD '} node_modules/${name} -> ${target}`)
  if (!inside) bad++
}
if (bad > 0) {
  console.error(`\n${bad} symlink(s) in .next/standalone/node_modules resolve OUTSIDE .next/standalone`)
  process.exit(1)
}
console.log('\nall standalone symlinks stay inside .next/standalone')
