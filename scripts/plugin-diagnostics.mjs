// Minimal "next tsc"-like runner: loads the Next.js TS language-service plugin
// the same way editors do, and prints its semantic diagnostics for the project.
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const nextPluginFactory = require('next')

const dir = process.cwd()
const configPath = ts.findConfigFile(dir, ts.sys.fileExists, 'tsconfig.json')
const parsed = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  dir
)

const files = parsed.fileNames
const compilerOptions = parsed.options
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

const info = {
  project: {
    projectService: { logger: { info: () => {} } },
    getCurrentDirectory: () => dir,
  },
  languageService,
  languageServiceHost,
  serverHost: null,
  config: {},
}

const plugin = nextPluginFactory({ typescript: ts })
const service = plugin.create(info)

let count = 0
for (const fileName of files) {
  for (const d of service.getSemanticDiagnostics(fileName)) {
    count++
    const { line, character } = ts.getLineAndCharacterOfPosition(
      d.file,
      d.start
    )
    const category = ts.DiagnosticCategory[d.category].toLowerCase()
    console.log(
      `${path.relative(dir, fileName)}(${line + 1},${character + 1}): ${category} ts(${d.code}): ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`
    )
  }
}
console.log(`\n${count} diagnostic(s) from the Next.js TS plugin`)
process.exit(count > 0 ? 1 : 0)
