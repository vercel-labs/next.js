// Shows the separator mismatch that makes the dev-types filter a no-op on Windows.
import path from 'path'
import ts from 'typescript'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { getDevTypesPath } = require('next/dist/lib/typescript/type-paths.js')

const cfg = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, process.cwd())
const devFiles = parsed.fileNames.filter((f) => f.includes('dev/types'))

const posixDir = path.posix.join(process.cwd(), '.next', 'dev', 'types')
const win32Dir = path.win32.join('C:\\proj', '.next', 'dev', 'types')

console.log('tsconfig fileName      :', devFiles[0])
console.log('getDevTypesPath (host) :', getDevTypesPath(process.cwd(), '.next'))
console.log('filters on this host?  :', devFiles[0]?.startsWith(getDevTypesPath(process.cwd(), '.next')))
console.log('--- windows semantics ---')
console.log('getDevTypesPath (win32):', win32Dir)
console.log('tsconfig fileName      :', 'C:/proj/.next/dev/types/validator.ts')
console.log('filters on windows?    :', 'C:/proj/.next/dev/types/validator.ts'.startsWith(win32Dir))
