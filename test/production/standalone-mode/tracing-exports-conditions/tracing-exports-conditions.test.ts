import { join } from 'path'
import { readdir } from 'fs/promises'
import { nextTestSetup } from 'e2e-utils'

// https://github.com/vercel/next.js/issues/97450
describe('standalone mode - tracing exports conditions', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    skipStart: true,
  })

  if (skipped) {
    return
  }

  it('should trace non-node exports conditions of external packages', async () => {
    const { exitCode } = await next.build()
    expect(exitCode).toBe(0)

    const trace = await next.readJSON(
      '.next/server/app/api/ping/route.js.nft.json'
    )
    const tracedPkgFiles = trace.files
      .filter((file: string) => file.includes('/conditional-exports-pkg/'))
      .map((file: string) => file.split('/').pop())
      .sort()

    // the `node` condition is traced today, the `bun`/`default` condition
    // targets are needed when the standalone output runs under another runtime
    expect(tracedPkgFiles).toEqual(
      expect.arrayContaining(['node.mjs', 'web.mjs'])
    )

    const standalonePkgFiles = await readdir(
      join(
        next.testDir,
        '.next/standalone/node_modules/conditional-exports-pkg'
      )
    )
    expect(standalonePkgFiles.sort()).toEqual(
      expect.arrayContaining(['node.mjs', 'package.json', 'web.mjs'])
    )
  })
})
