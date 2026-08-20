import path from 'path'
import { nextTestSetup } from 'e2e-utils'

// Regression test for https://github.com/vercel/next.js/issues/43433:
// a package listed in `serverExternalPackages` that is resolved through a
// workspace symlink (its real path is not inside any `node_modules`
// directory, like a monorepo workspace dependency) must still be left
// external instead of being bundled.
describe('app-dir - server components externals (workspace package)', () => {
  const { next, skipped } = nextTestSetup({
    // This test is skipped when deployed because it relies on manually linked
    // `node_modules`.
    skipDeployment: true,
    files: __dirname,
    // The symlink has to be created after the test directory is set up but
    // before Next.js builds/starts, so the instance is started manually below.
    skipStart: true,
  })

  if (skipped) return

  beforeAll(async () => {
    await next.symlink(
      'packages/workspace-package',
      'node_modules/workspace-package'
    )
    await next.start()
  })

  it('should have externals for workspace packages resolved through a symlink', async () => {
    const $ = await next.render$('/')

    // Resolving to the package's own directory is what proves it stayed
    // external. A bundled copy reports the build-time inlined directory
    // instead.
    expect($('#directory').text()).toBe(
      path.join(next.testDir, 'packages', 'workspace-package')
    )
  })
})
