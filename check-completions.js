// Queries the TypeScript language service for auto-import completions of
// `revalidatePath`, exactly like an editor does, and prints every candidate.
const ts = require('typescript')
const fs = require('fs')
const path = require('path')

const probe = path.resolve('probe.generated.ts')
fs.writeFileSync(probe, 'revalidatePat\n')

const cfg = ts.getParsedCommandLineOfConfigFile('tsconfig.json', {}, {
  ...ts.sys,
  onUnRecoverableConfigFileDiagnostic() {},
})

const files = [
  ...cfg.fileNames.filter((f) => !f.endsWith('probe.generated.ts')),
  probe,
]

const host = {
  getScriptFileNames: () => files,
  getScriptVersion: () => '1',
  getScriptSnapshot: (f) =>
    fs.existsSync(f)
      ? ts.ScriptSnapshot.fromString(fs.readFileSync(f, 'utf8'))
      : undefined,
  getCurrentDirectory: () => process.cwd(),
  getCompilationSettings: () => cfg.options,
  getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
  fileExists: ts.sys.fileExists,
  readFile: ts.sys.readFile,
  readDirectory: ts.sys.readDirectory,
  directoryExists: ts.sys.directoryExists,
  getDirectories: ts.sys.getDirectories,
}

const service = ts.createLanguageService(host)
const completions = service.getCompletionsAtPosition(probe, 13, {
  includeCompletionsForModuleExports: true,
  includeCompletionsWithInsertText: true,
})
fs.unlinkSync(probe)

const hits = (completions ? completions.entries : []).filter(
  (e) => e.name === 'revalidatePath'
)

console.log(
  `.next/types/cache-life.d.ts present: ${fs.existsSync(
    '.next/types/cache-life.d.ts'
  )}`
)
console.log(`auto-import suggestions for "revalidatePath": ${hits.length}`)
for (const h of hits) {
  console.log(
    `  - from "${h.source}" via ${
      h.data && h.data.ambientModuleName
        ? 'ambient declaration (declare module ' + h.data.ambientModuleName + ')'
        : 'file ' + ((h.data && h.data.fileName) || '?')
    }`
  )
}
if (hits.length > 1) {
  console.log('\nFAIL: duplicate `next/cache` auto-import entries')
  process.exit(1)
}
console.log('\nOK: single `next/cache` auto-import entry')
