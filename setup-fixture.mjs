// Creates a "mylib" dependency whose real path lives in a store directory and is
// symlinked into node_modules (pnpm / yarn-store style layout). This is the layout
// where the empty vs. populated `resolvedExternalPackageDirs` map changes the result.
import fs from 'node:fs'
import path from 'node:path'
const nm = path.join(process.cwd(), 'node_modules')
const real = path.join(nm, '.store', 'mylib-1.0.0')
fs.mkdirSync(real, { recursive: true })
fs.writeFileSync(
  path.join(real, 'package.json'),
  JSON.stringify({ name: 'mylib', version: '1.0.0', main: 'index.js' }, null, 2)
)
fs.writeFileSync(path.join(real, 'index.js'), 'export const greet = (n) => `hello ${n} from mylib`;\n')
const link = path.join(nm, 'mylib')
fs.rmSync(link, { recursive: true, force: true })
fs.symlinkSync(path.join('.store', 'mylib-1.0.0'), link)
console.log('fixture ready:', fs.realpathSync(link))
