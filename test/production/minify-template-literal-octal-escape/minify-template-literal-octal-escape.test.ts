import { nextTestSetup } from 'e2e-utils'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import vm from 'vm'

// Regression test for https://github.com/vercel/next.js/issues/97331
// The minifier re-emitted a `\x00` escape inside a template literal as `\0`.
// When the next character is a digit that becomes `\00`, an octal escape, which
// is a SyntaxError inside a template literal, so the whole client chunk failed
// to parse in the browser even though the build itself succeeded.
describe('minify template literal octal escape', () => {
  const { next } = nextTestSetup({ files: __dirname })

  it('should emit parseable client chunks', async () => {
    const staticDir = join(next.testDir, '.next', 'static')
    const chunks = readdirSync(staticDir, { recursive: true })
      .map(String)
      .filter((file) => file.endsWith('.js'))

    expect(chunks.length).toBeGreaterThan(0)

    const parseErrors: string[] = []
    for (const chunk of chunks) {
      const code = readFileSync(join(staticDir, chunk), 'utf8')
      try {
        new vm.Script(code, { filename: chunk })
      } catch (err) {
        parseErrors.push(`${chunk}: ${(err as Error).message}`)
      }
    }

    expect(parseErrors).toEqual([])
  })
})
