import fs from 'fs/promises'
import path from 'path'
import { nextTestSetup } from 'e2e-utils'

type ExportsEntry = { default?: string; 'module-sync'?: string }

// Node.js >= 22.12 honors the "module-sync" export condition for `require()`,
// so `require('@swc/helpers/_/_interop_require_default')` resolves to the ESM
// file (`esm/*.js`) instead of the CJS one (`cjs/*.cjs`). File tracing has to
// include both variants, otherwise `.next/standalone` misses the file the
// runtime actually loads and the standalone server crashes on startup with
// `Cannot find module '.../@swc/helpers/esm/_interop_require_default.js'`.
// https://github.com/vercel/next.js/issues/97356
describe('standalone mode - module-sync export condition', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    skipStart: true,
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  it('traces the module-sync target of helpers required by next-server', async () => {
    const { exitCode } = await next.build()
    expect(exitCode).toBe(0)

    // Trace entries are relative to `distDir`.
    const trace: { files: string[] } = await next.readJSON(
      '.next/next-server.js.nft.json'
    )
    const tracedFiles = new Set(trace.files)
    const helperFiles = trace.files.filter((file) =>
      file.includes('/@swc/helpers/')
    )

    const packageJsonFile = helperFiles.find((file) =>
      file.endsWith('/@swc/helpers/package.json')
    )
    expect(packageJsonFile).toBeDefined()

    const packageDir = path.posix.dirname(packageJsonFile!)
    const { exports: exportsMap } = JSON.parse(
      await fs.readFile(
        path.join(next.testDir, '.next', packageJsonFile!),
        'utf8'
      )
    )
    const entries = Object.values(exportsMap as Record<string, ExportsEntry>)

    // The `@swc/helpers` subpaths `next-server` requires at runtime.
    const requireTargets = helperFiles.filter((file) => file.endsWith('.cjs'))
    expect(requireTargets.length).toBeGreaterThan(0)

    const expectedModuleSyncFiles = requireTargets
      .map((file) => {
        const subpath = `./${path.posix.relative(packageDir, file)}`
        return entries.find(
          (entry) => entry?.default === subpath && entry['module-sync']
        )?.['module-sync']
      })
      .filter((target): target is string => typeof target === 'string')
      .map((target) => path.posix.join(packageDir, target))

    expect(expectedModuleSyncFiles.length).toBeGreaterThan(0)
    expect(
      expectedModuleSyncFiles.filter((file) => !tracedFiles.has(file))
    ).toEqual([])
  })
})
