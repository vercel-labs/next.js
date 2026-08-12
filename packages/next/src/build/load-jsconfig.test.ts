import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import loadJsConfig from './load-jsconfig'
import type { NextConfigComplete } from '../server/config-shared'

const paths = { '@/*': ['./*'] }

/**
 * Writes an app with `compilerOptions.paths` and a project-local `typescript`
 * package whose CLI is exposed under `binName`.
 *
 * `@typescript/typescript6` (the alias the TypeScript team recommends for
 * adopting TypeScript 7 incrementally) ships its CLI as `bin.tsc6`, while
 * `typescript` itself ships `bin.tsc`.
 */
function createFixture(binName: string): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'next-load-jsconfig-'))
  const packageDir = path.join(dir, 'node_modules', 'typescript')

  writeFileSync(
    path.join(dir, 'tsconfig.json'),
    JSON.stringify({ compilerOptions: { paths } })
  )
  mkdirSync(path.join(packageDir, 'bin'), { recursive: true })
  mkdirSync(path.join(packageDir, 'lib'), { recursive: true })
  writeFileSync(
    path.join(packageDir, 'package.json'),
    JSON.stringify({
      name: 'typescript',
      version: '6.0.2',
      main: './lib/typescript.js',
      bin: { [binName]: `bin/${binName}` },
    })
  )
  writeFileSync(path.join(packageDir, 'lib', 'typescript.js'), '')
  // Stand-in for `tsc --showConfig`, the only CLI call `loadJsConfig` makes.
  writeFileSync(
    path.join(packageDir, 'bin', binName),
    `console.log(JSON.stringify(${JSON.stringify({ compilerOptions: { paths } })}))\n`
  )

  return dir
}

function createConfig(): NextConfigComplete {
  return {
    experimental: { useTypeScriptCli: true },
    typescript: { tsconfigPath: 'tsconfig.json' },
  } as unknown as NextConfigComplete
}

describe('loadJsConfig with experimental.useTypeScriptCli', () => {
  const fixtures: string[] = []

  afterAll(() => {
    for (const dir of fixtures) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  function setup(binName: string) {
    const dir = createFixture(binName)
    fixtures.push(dir)
    return dir
  }

  it('loads tsconfig paths when the TypeScript CLI bin is named tsc', async () => {
    const dir = setup('tsc')

    const { useTypeScript, jsConfig, resolvedBaseUrl } = await loadJsConfig(
      dir,
      createConfig()
    )

    expect(useTypeScript).toBe(true)
    expect(jsConfig?.compilerOptions.paths).toEqual(paths)
    expect(resolvedBaseUrl?.baseUrl).toBe(dir)
  })

  it('loads tsconfig paths when typescript is aliased to @typescript/typescript6 (bin tsc6)', async () => {
    const dir = setup('tsc6')

    const { useTypeScript, jsConfig, resolvedBaseUrl } = await loadJsConfig(
      dir,
      createConfig()
    )

    // Regression test: the CLI bin was resolved from `bin.tsc` only, so a
    // `typescript` package exposing `bin.tsc6` made Next.js skip tsconfig.json
    // entirely and silently drop every `paths` alias, breaking webpack builds
    // with "Module not found" for aliased imports.
    expect(useTypeScript).toBe(true)
    expect(jsConfig?.compilerOptions.paths).toEqual(paths)
    expect(resolvedBaseUrl?.baseUrl).toBe(dir)
  })
})
