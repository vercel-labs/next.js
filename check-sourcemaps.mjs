/**
 * Inspects the source maps `next dev --turbopack` emits for the server chunks
 * (run `npm run repro` or `npm run dev` + one page load first) and reports:
 *  - sources that still use the non-file `turbopack://` scheme
 *  - sources that point at files that do not exist on disk
 * Both make VSCode/Cursor (vscode-js-debug) show "cryptic" unreadable code.
 */
import fs from 'node:fs'
import path from 'node:path'

const dirs = ['.next/dev/server', '.next/server'].filter((d) => fs.existsSync(d))
if (!dirs.length) {
  console.error('no build output found - run `npm run repro` first')
  process.exit(1)
}
const sources = new Set()
const unparsable = []
const collect = (m) => {
  for (const s of m.sources ?? []) sources.add(s)
  for (const sec of m.sections ?? []) collect(sec.map ?? {})
}
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith('.map')) {
      try {
        collect(JSON.parse(fs.readFileSync(p, 'utf8')))
      } catch (err) {
        unparsable.push([p, String(err.message).slice(0, 80)])
      }
    }
  }
}
dirs.forEach(walk)
const scheme = [...sources].filter((s) => /^turbopack:/.test(s))
const missing = [...sources].filter((s) => s.startsWith('file://') && !fs.existsSync(decodeURIComponent(s.slice(7))))
console.log('map sources total:', sources.size)
console.log('unparsable .map files:', unparsable.length, unparsable.slice(0, 5))
console.log(`sources using turbopack:// scheme: ${scheme.length}`)
console.log(scheme.slice(0, 10).join('\n'))
console.log(`sources pointing at non-existent files: ${missing.length}/${sources.size}`)
console.log(missing.slice(0, 10).join('\n'))
