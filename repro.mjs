// Reproduces vercel/next.js#97216 on any OS.
//
// runTypeCheck filters out `.next/dev/types` files with
//   fileName.startsWith(getDevTypesPath(baseDir, distDir))
// getDevTypesPath returns path.join(...) (backslashes on Windows) while the
// tsconfig-parsed fileNames always use forward slashes -> the filter never
// matches on Windows and `next build` type-checks generated dev types.
//
// Phase 1 (control): unpatched next on this host (POSIX) -> filter works, build passes
//                    even though .next/dev/types/validator.ts is syntactically broken.
// Phase 2 (windows): getDevTypesPath patched to path.win32.join, i.e. exactly what
//                    Node's path.join does on Windows -> build fails type-checking
//                    .next/dev/types/validator.ts.
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const root = process.cwd()
const typePaths = path.join(root, 'node_modules/next/dist/lib/typescript/type-paths.js')
const ORIGINAL = "return _path.default.join(baseDir, distDir, 'dev', 'types');"
const WINDOWS = "return _path.default.win32.join(baseDir, distDir, 'dev', 'types');"

function seedDevTypes() {
  const dest = path.join(root, '.next/dev/types')
  fs.mkdirSync(dest, { recursive: true })
  for (const f of fs.readdirSync('fixtures/dev-types')) {
    fs.copyFileSync(path.join('fixtures/dev-types', f), path.join(dest, f))
  }
}

function patch(to) {
  const src = fs.readFileSync(typePaths, 'utf8')
  const from = to === WINDOWS ? ORIGINAL : WINDOWS
  if (!src.includes(from)) throw new Error('unexpected type-paths.js contents')
  fs.writeFileSync(typePaths, src.replace(from, to))
}

function build(label) {
  seedDevTypes()
  console.log(`\n=== ${label}: next build ===`)
  try {
    execSync('npx next build', { stdio: 'inherit' })
    console.log(`>>> ${label}: build PASSED (dev types were filtered out)`)
    return true
  } catch {
    console.log(`>>> ${label}: build FAILED (dev types entered the TS program)`)
    return false
  }
}

const posixOk = build('phase 1 / host path.join (POSIX)')
patch(WINDOWS)
let winOk
try {
  winOk = build('phase 2 / simulated Windows path.join')
} finally {
  patch(ORIGINAL)
}

console.log('\n================ RESULT ================')
console.log('POSIX  build passed :', posixOk, '(expected true)')
console.log('WIN32  build passed :', winOk, '(expected false -> bug reproduced)')
process.exit(posixOk && !winOk ? 0 : 1)
