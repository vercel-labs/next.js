// Reproduction for vercel/next.js#65608
// "Could not open page.js in the editor" for files inside a route group on Windows.
//
// Next.js validates the file path against WINDOWS_FILE_NAME_ACCESS_LIST in
// next/dist/next-devtools/server/launch-editor.js before spawning the editor.
// The list allows only letters, digits, `.`, `-`, `/`, `\` and `_`, so any path
// containing a route-group segment such as `(group)` is rejected and the editor
// is never launched. This script forces the win32 branch so the exact same
// failure is observable on any OS.
import fs from 'fs'
import path from 'path'

Object.defineProperty(process, 'platform', { value: 'win32' })
process.env.REACT_EDITOR = 'code'

const { launchEditor } = await import(
  'next/dist/next-devtools/server/launch-editor.js'
)

const cases = [
  ['route group  ', 'app/(group)/broken/page.tsx'],
  ['no route group', 'app/working/page.tsx'],
]

let rejected = false
for (const [label, rel] of cases) {
  const file = path.resolve(rel)
  console.log(`\n=== ${label}: ${rel} (exists: ${fs.existsSync(file)})`)
  const original = console.log
  let output = ''
  console.log = (...a) => {
    output += a.join(' ') + '\n'
    original(...a)
  }
  launchEditor(file, 2, 3)
  console.log = original
  if (output.includes('checked against an access list')) {
    rejected = true
    console.log(`>>> BUG: ${rel} was rejected by the Windows access list`)
  }
}

console.log(
  '\nnext:',
  JSON.parse(fs.readFileSync('node_modules/next/package.json')).version
)
process.exit(rejected ? 1 : 0)
