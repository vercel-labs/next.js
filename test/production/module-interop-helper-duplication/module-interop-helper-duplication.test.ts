import { nextTestSetup } from 'e2e-utils'
import fs from 'fs/promises'
import path from 'path'

// The CommonJS default-export interop epilogue that Next.js' own precompiled
// modules carry is inlined into every module instead of being emitted once as a
// shared helper, which bloats the client bundle of even an empty app.
// x-ref: https://github.com/vercel/next.js/issues/37142
const INTEROP_EPILOGUE = /Object\.assign\((\w+)\.default,\s*\1\)/g

describe('module interop helper duplication', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  it('should not inline the CJS default-export interop helper into every module', async () => {
    // Client chunks live in `.next/static/chunks` (webpack) or
    // `.next/static/immutable/chunks` (Turbopack).
    const staticDir = path.join(next.testDir, '.next', 'static')
    const files = (await fs.readdir(staticDir, { recursive: true })).filter(
      (file) => file.endsWith('.js') && file.includes('chunks')
    )
    expect(files.length).toBeGreaterThan(0)

    const occurrencesPerChunk: Record<string, number> = {}
    let totalOccurrences = 0

    for (const file of files) {
      const content = await fs.readFile(path.join(staticDir, file), 'utf8')
      const count = (content.match(INTEROP_EPILOGUE) ?? []).length
      if (count > 0) {
        occurrencesPerChunk[file] = count
      }
      totalOccurrences += count
    }

    console.log('interop epilogue occurrences:', occurrencesPerChunk)

    // A shared helper is emitted at most once per client bundle.
    expect(totalOccurrences).toBeLessThanOrEqual(1)
  })
})
