import { nextTestSetup } from 'e2e-utils'
import execa from 'execa'
import fs from 'fs'
import glob from 'glob'
import path from 'path'

// Regression test for https://github.com/vercel/next.js/issues/97599
//
// `@swc/helpers@0.5.23` added a `module-sync` export condition to its `./_/*`
// subpaths that points at the `esm/` files, ahead of the `default` (`cjs/`)
// target. Node.js >= 22.12 prefers `module-sync` for `require()`, so the
// standalone server resolves `@swc/helpers/_/_interop_require_default` (required
// by `next/dist/server/require-hook.js`) to `esm/_interop_require_default.js`.
// Output file tracing only resolved the `default`/`cjs` target, so those files
// were never copied and `node .next/standalone/server.js` crashed at boot with
// `MODULE_NOT_FOUND`.
describe('standalone mode - @swc/helpers module-sync exports', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    skipStart: true,
  })

  if (skipped) {
    return
  }

  it('should copy the @swc/helpers files that require() resolves at runtime', async () => {
    const { exitCode } = await next.build()
    expect(exitCode).toBe(0)

    const standaloneDir = path.join(next.testDir, '.next/standalone')

    // Resolve the helpers the same way the standalone server does at boot: from
    // the traced copy of Next.js (realpath, like Node.js resolves modules) and
    // with the real Node.js CJS resolver, so whichever export condition the
    // current Node.js version picks has to be present in the output.
    const requireHooks = [
      ...new Set(
        glob
          .sync('**/node_modules/next/dist/server/require-hook.js', {
            cwd: standaloneDir,
            absolute: true,
          })
          .map((file) => fs.realpathSync(file))
      ),
    ]
    expect(requireHooks.length).toBeGreaterThan(0)

    const helpers = [
      '@swc/helpers/_/_interop_require_default',
      '@swc/helpers/_/_interop_require_wildcard',
    ]

    for (const requireHook of requireHooks) {
      const { exitCode, stderr } = await execa(
        process.execPath,
        [
          '-e',
          `const { createRequire } = require('module')
           const requireFromNext = createRequire(${JSON.stringify(requireHook)})
           for (const id of ${JSON.stringify(helpers)}) {
             requireFromNext(id)
           }`,
        ],
        { cwd: standaloneDir, reject: false }
      )

      expect(stderr).not.toContain('MODULE_NOT_FOUND')
      expect(exitCode).toBe(0)
    }
  })
})
