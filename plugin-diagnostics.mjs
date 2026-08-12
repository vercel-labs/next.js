// Headless proof that the Next.js TS language-service plugin produces diagnostics
// that `tsc` (and every `next` CLI subcommand) never reports.
// Mirrors test/development/typescript-plugin/test-utils.ts from vercel/next.js.
import path from 'node:path'
import ts from 'typescript'
import tsNextPluginFactory from 'next'

const dir = process.cwd()
const files = ts.sys.readDirectory(path.join(dir, 'app')).filter((f) => /\.tsx?$/.test(f))

const compilerOptions = ts.getDefaultCompilerOptions()
const compilerHost = ts.createCompilerHost(compilerOptions)

const languageServiceHost = {
  ...compilerHost,
  getCompilationSettings: () => compilerOptions,
  getScriptFileNames: () => files,
  getScriptSnapshot: (fileName) => {
    const contents = ts.sys.readFile(fileName)
    return typeof contents === 'string'
      ? ts.ScriptSnapshot.fromString(contents)
      : undefined
  },
  getScriptVersion: () => '0',
  writeFile: ts.sys.writeFile,
}

const languageService = ts.createLanguageService(languageServiceHost)

const plugin = tsNextPluginFactory({ typescript: ts })
const service = plugin.create({
  project: {
    projectService: { logger: { info: () => {} } },
    getCurrentDirectory: () => dir,
  },
  languageService,
  languageServiceHost,
  serverHost: null,
  config: {},
})

const file = path.join(dir, 'app', 'page.tsx')
const nextDiagnostics = service.getSemanticDiagnostics(file)
const plainDiagnostics = languageService.getSemanticDiagnostics(file)

const fmt = (d) =>
  `  ts(${d.code}) [${ts.DiagnosticCategory[d.category]}] ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`

console.log('plugin-wrapped language service diagnostics for app/page.tsx:')
console.log(nextDiagnostics.map(fmt).join('\n') || '  (none)')
console.log('\nplain TypeScript (what `tsc` sees):')
console.log(plainDiagnostics.map(fmt).join('\n') || '  (none)')
