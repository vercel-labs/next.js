// Demonstrates why `next build` only fails on Windows.
// next/dist/lib/typescript/runTypeCheck.js filters generated dev types with:
//   fileName.startsWith(path.join(baseDir, distDir, 'dev', 'types'))
// TypeScript's parsed `fileNames` always use forward slashes, while path.join()
// uses backslashes on Windows, so the filter never matches there.
import path from 'node:path'

const devTypesDir = path.win32.join('C:\\Projekte\\next-test', '.next', 'dev', 'types')
const tsFileName = 'C:/Projekte/next-test/.next/dev/types/validator.ts'

console.log('devTypesDir (path.win32.join):', devTypesDir)
console.log('fileName from TypeScript     :', tsFileName)
console.log('stale dev type filtered out? :', tsFileName.startsWith(devTypesDir), '<- false on Windows')

const posixDir = path.posix.join('/home/user/next-test', '.next', 'dev', 'types')
const posixFile = '/home/user/next-test/.next/dev/types/validator.ts'
console.log('\nposix devTypesDir            :', posixDir)
console.log('stale dev type filtered out? :', posixFile.startsWith(posixDir), '<- true on macOS/Linux')
