import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
// eslint-disable-next-line import/no-extraneous-dependencies
import ts from 'typescript'
import { generateCacheLifeTypes } from './cache-life-type-utils'

// The public `next/cache` exports that the generated `cache-life.d.ts` has to
// re-export.
const NEXT_CACHE_EXPORTS = [
  'revalidatePath',
  'revalidateTag',
  'updateTag',
  'refresh',
  'unstable_cache',
  'unstable_noStore',
  'cacheTag',
  'cacheLife',
  'unstable_cacheTag',
  'unstable_cacheLife',
]

const ADD_IMPORT_FROM_NEXT_CACHE = 'Add import from "next/cache"'

// packages/next/cache.d.ts, i.e. the types a user gets from node_modules/next.
const packageCacheTypesPath = join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'cache.d.ts'
)

/**
 * Sets up a project that mimics a user's app: `next` in `node_modules` with its
 * own `cache.d.ts`, plus one file per export in which auto-import completions
 * are requested for a bare identifier (what an editor sends while typing).
 */
function createProject() {
  const dir = mkdtempSync(join(tmpdir(), 'next-cache-life-completions-'))

  mkdirSync(join(dir, 'node_modules', 'next'), { recursive: true })
  copyFileSync(
    packageCacheTypesPath,
    join(dir, 'node_modules', 'next', 'cache.d.ts')
  )
  writeFileSync(
    join(dir, 'node_modules', 'next', 'package.json'),
    JSON.stringify({
      name: 'next',
      version: '0.0.0',
      exports: { './cache': { types: './cache.d.ts' } },
    })
  )

  mkdirSync(join(dir, '.next', 'types'), { recursive: true })
  writeFileSync(
    join(dir, '.next', 'types', 'cache-life.d.ts'),
    generateCacheLifeTypes({
      custom: { stale: 100, revalidate: 200, expire: 300 },
    })
  )

  const sourceFiles: Record<string, string> = {}

  for (const exportName of NEXT_CACHE_EXPORTS) {
    const fileName = join(dir, `use-${exportName}.ts`)
    writeFileSync(fileName, `export function f() {\n  ${exportName}\n}\n`)
    sourceFiles[exportName] = fileName
  }

  return { dir, sourceFiles }
}

/**
 * Drives the same LanguageService API that tsserver (and therefore editor
 * IntelliSense) uses, and counts the `next/cache` auto-import completions
 * offered for every export.
 */
function countNextCacheAutoImports(
  dir: string,
  sourceFiles: Record<string, string>,
  { withGeneratedTypes }: { withGeneratedTypes: boolean }
): Record<string, number> {
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
  }

  const rootFiles = [
    ...Object.values(sourceFiles),
    join(dir, 'node_modules', 'next', 'cache.d.ts'),
  ]

  if (withGeneratedTypes) {
    rootFiles.push(join(dir, '.next', 'types', 'cache-life.d.ts'))
  }

  const service = ts.createLanguageService({
    getScriptFileNames: () => rootFiles,
    getScriptVersion: () => '1',
    getScriptSnapshot: (fileName) => {
      const contents = ts.sys.readFile(fileName)
      return contents === undefined
        ? undefined
        : ts.ScriptSnapshot.fromString(contents)
    },
    getCurrentDirectory: () => dir,
    getCompilationSettings: () => compilerOptions,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
    realpath: ts.sys.realpath,
  })

  const preferences: ts.GetCompletionsAtPositionOptions = {
    includeCompletionsForModuleExports: true,
    includeInsertTextCompletions: true,
  }

  const counts: Record<string, number> = {}

  for (const exportName of NEXT_CACHE_EXPORTS) {
    const fileName = sourceFiles[exportName]
    const text = ts.sys.readFile(fileName)!
    const position =
      text.indexOf(exportName, text.indexOf('{')) + exportName.length

    const completions = service.getCompletionsAtPosition(
      fileName,
      position,
      preferences
    )

    let count = 0

    for (const entry of completions?.entries ?? []) {
      if (entry.name !== exportName) continue

      const details = service.getCompletionEntryDetails(
        fileName,
        position,
        entry.name,
        ts.getDefaultFormatCodeSettings('\n'),
        entry.source,
        preferences,
        entry.data
      )

      for (const codeAction of details?.codeActions ?? []) {
        if (codeAction.description === ADD_IMPORT_FROM_NEXT_CACHE) {
          count++
        }
      }
    }

    counts[exportName] = count
  }

  return counts
}

describe('cache-life types auto-import completions', () => {
  let dir: string
  let sourceFiles: Record<string, string>

  beforeAll(() => {
    ;({ dir, sourceFiles } = createProject())
  })

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('offers each next/cache export once without the generated types', () => {
    expect(
      countNextCacheAutoImports(dir, sourceFiles, { withGeneratedTypes: false })
    ).toEqual(Object.fromEntries(NEXT_CACHE_EXPORTS.map((name) => [name, 1])))
  })

  it('offers each next/cache export once with the generated types', () => {
    // The generated `cache-life.d.ts` must augment `next/cache` instead of
    // shadowing it with a standalone ambient module declaration, otherwise
    // TypeScript offers two indistinguishable `Add import from "next/cache"`
    // completions for every export.
    expect(
      countNextCacheAutoImports(dir, sourceFiles, { withGeneratedTypes: true })
    ).toEqual(Object.fromEntries(NEXT_CACHE_EXPORTS.map((name) => [name, 1])))
  })
})
