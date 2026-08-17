import fs from 'fs-extra'
import path from 'path'
import { SourceMap } from 'module'
import { nextTestSetup } from 'e2e-utils'
import { shouldUseTurbopack } from 'next-test-utils'

// Error messages of the expressions we resolve through the emitted source map.
// `direct error` is thrown from a plain module-level function, the other three
// live inside component callbacks that capture the memoized state updater and
// are therefore hoisted by the React Compiler.
const errorMessages = [
  'direct error',
  'timeout error',
  'rejection error',
  'reported error',
]

async function findClientChunkContaining(
  dir: string,
  needles: string[]
): Promise<{ filePath: string; content: string }> {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      try {
        return await findClientChunkContaining(filePath, needles)
      } catch {
        continue
      }
    }
    if (!entry.name.endsWith('.js')) {
      continue
    }
    const content = await fs.readFile(filePath, 'utf8')
    if (needles.every((needle) => content.includes(needle))) {
      return { filePath, content }
    }
  }
  throw new Error(`No client chunk in ${dir} contains ${needles.join(', ')}.`)
}

describe('react-compiler rust source maps', () => {
  if (!shouldUseTurbopack()) {
    it.skip('the Rust React Compiler requires Turbopack', () => {})
    return
  }

  const { next, skipped } = nextTestSetup({
    files: __dirname,
    nextConfig: {
      reactCompiler: true,
      productionBrowserSourceMaps: true,
      experimental: { turbopackRustReactCompiler: true },
    },
    // Deployments don't give us access to the built client chunks.
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  it('maps errors hoisted out of component callbacks to their original source lines', async () => {
    const { filePath, content } = await findClientChunkContaining(
      path.join(next.testDir, next.distDir, 'static'),
      errorMessages
    )

    const sourceMappingURL = content.match(
      /\/\/[#@] sourceMappingURL=([^\s]+)/
    )?.[1]
    expect(sourceMappingURL).toBeTruthy()

    const sourceMap = new SourceMap(
      JSON.parse(
        await fs.readFile(
          path.join(path.dirname(filePath), sourceMappingURL),
          'utf8'
        )
      )
    )
    const originalLines = (
      await fs.readFile(path.join(next.testDir, 'app', 'page.tsx'), 'utf8')
    ).split('\n')

    const mappedSourceLines: Record<string, string> = {}
    for (const errorMessage of errorMessages) {
      const match = content.match(
        new RegExp(`Error\\(\\s*["']${errorMessage}["']\\s*\\)`)
      )
      expect(match).toBeTruthy()

      const generatedBefore = content.slice(0, match.index).split('\n')
      const entry = sourceMap.findEntry(
        generatedBefore.length - 1,
        generatedBefore[generatedBefore.length - 1].length
      )

      expect(entry.originalSource).toContain('app/page.tsx')
      mappedSourceLines[errorMessage] =
        originalLines[entry.originalLine]?.trim() ?? '<out of range>'
    }

    // Each generated `new Error(…)` must map back to the original line that
    // creates it.
    expect(mappedSourceLines).toEqual({
      'direct error': "throw new Error('direct error')",
      'timeout error': "throw new Error('timeout error')",
      'rejection error': "void Promise.reject(new Error('rejection error'))",
      'reported error': "console.error(new Error('reported error'))",
    })
  })
})
