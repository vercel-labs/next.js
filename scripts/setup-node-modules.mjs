// Copy the local packages into node_modules as *real* directories so that they
// are genuine node_modules packages (not symlinks into the project root).
// This matters because files inside the project root are compiled by Next.js
// regardless of `transpilePackages`.
import { cpSync, rmSync, mkdirSync } from 'node:fs'

for (const name of ['dep', 'lib']) {
  rmSync(`node_modules/${name}`, { recursive: true, force: true })
  mkdirSync(`node_modules/${name}`, { recursive: true })
  cpSync(`packages/${name}`, `node_modules/${name}`, { recursive: true })
}
console.log('[setup] copied packages/{dep,lib} into node_modules')
