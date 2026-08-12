import { nextTestSetup } from 'e2e-utils'
import stripAnsi from 'strip-ansi'

// A server external package (`external-with-broken-dep`) requires
// `broken-entry-pkg`, whose `exports` map points at `./dist/index.js` – a file
// that does not exist (as happens with partial installs or pruned deploy
// layers). The external package is never bundled, so the missing dependency is
// only seen by output file tracing, which today drops the resolution failure:
// the build exits 0 without any diagnostic and the traced file set contains at
// most a bare `package.json` for the broken package, which then makes the
// deployed output fail at request time.
describe('output file tracing resolution failure', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipStart: true,
    skipDeployment: true,
  })

  it('should surface the failed dependency resolution in the build output', async () => {
    await next.build()

    const cliOutput = stripAnsi(next.cliOutput)

    expect(cliOutput).toContain('broken-entry-pkg')
  })
})
