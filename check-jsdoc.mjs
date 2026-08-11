// Reproduction for vercel/next.js#85271
// Prints the editor hover (JSDoc) text for `cacheComponents` in next.config.ts
// for each requested version of `next`, using the TypeScript language service.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import ts from 'typescript'

const versions = process.argv.slice(2)
if (versions.length === 0) versions.push('canary')

const CONFIG = `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
`

for (const version of versions) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `next-${version}-`))
  fs.writeFileSync(path.join(dir, 'package.json'), '{"name":"tmp","private":true}')
  execSync(`npm install --silent --no-audit --no-fund next@${version}`, {
    cwd: dir,
    stdio: 'ignore',
  })
  const installed = JSON.parse(
    fs.readFileSync(path.join(dir, 'node_modules/next/package.json'), 'utf8')
  ).version

  const file = path.join(dir, 'next.config.ts')
  fs.writeFileSync(file, CONFIG)

  const host = {
    getScriptFileNames: () => [file],
    getScriptVersion: () => '1',
    getScriptSnapshot: (f) =>
      fs.existsSync(f)
        ? ts.ScriptSnapshot.fromString(fs.readFileSync(f, 'utf8'))
        : undefined,
    getCurrentDirectory: () => dir,
    getCompilationSettings: () => ({
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      strict: true,
    }),
    getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  }
  const service = ts.createLanguageService(host, ts.createDocumentRegistry())
  const pos = CONFIG.indexOf('cacheComponents') + 2
  const info = service.getQuickInfoAtPosition(file, pos)
  const docs = ts.displayPartsToString(info?.documentation ?? [])

  console.log(`\n=== next@${installed} — hover on \`cacheComponents\` in next.config.ts ===`)
  console.log(docs || '(no documentation)')
  const misleading = /automatically cache\s+page-level components/.test(docs)
  console.log(`misleading "automatically cache page-level components" text present: ${misleading}`)
}
