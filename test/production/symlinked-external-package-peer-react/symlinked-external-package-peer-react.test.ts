import { nextTestSetup } from 'e2e-utils'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'

// Regression test for https://github.com/vercel/next.js/issues/20266
//
// A locally developed package that keeps `react` as a peer dependency and is
// linked into the app (`npm link` / `yarn link`) resolves to a real path
// outside of the app directory. Resolution has to keep looking for `react` in
// the app's `node_modules`, otherwise the build fails with
// "Module not found: Can't resolve 'react'" (webpack) or it cannot resolve the
// linked package at all (Turbopack).
describe('symlinked external package with react as a peer dependency', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    // The symlink has to be created in the test directory, which is not
    // available when the app is built and deployed remotely.
    skipDeployment: true,
    skipStart: true,
  })

  if (skipped) {
    return
  }

  it('resolves react from the app when the package is linked from outside of the app directory', async () => {
    const externalDir = await fs.mkdtemp(
      path.join(await fs.realpath(os.tmpdir()), 'external-package-')
    )

    await fs.writeFile(
      path.join(externalDir, 'package.json'),
      JSON.stringify({
        name: 'external-package',
        version: '1.0.0',
        main: 'index.js',
        peerDependencies: { react: '*' },
      })
    )

    await fs.writeFile(
      path.join(externalDir, 'index.js'),
      `const React = require('react')\n` +
        `module.exports.Hello = function Hello() {\n` +
        `  return React.createElement('p', { id: 'hello' }, 'hello from external package')\n` +
        `}\n`
    )

    const linkPath = path.join(next.testDir, 'node_modules', 'external-package')
    await fs.rm(linkPath, { force: true, recursive: true })
    await fs.symlink(externalDir, linkPath, 'junction')

    try {
      const { exitCode, cliOutput } = await next.build()

      expect(cliOutput).not.toContain("Can't resolve 'react'")
      expect(cliOutput).not.toContain("Can't resolve 'external-package'")
      expect(exitCode).toBe(0)
    } finally {
      await fs.rm(linkPath, { force: true, recursive: true })
      await fs.rm(externalDir, { force: true, recursive: true })
    }
  })
})
