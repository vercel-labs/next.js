import path from 'path'
import { nextTestSetup } from 'e2e-utils'

// This test emulates a host where the native `@next/swc-*` binding cannot be
// loaded (e.g. RHEL 8 / Debian 10, which ship glibc 2.28 while the prebuilt
// `@next/swc-linux-x64-gnu` binary requires GLIBC_2.29) so Next.js falls back
// to the WebAssembly bindings. Turbopack requires native bindings, so the
// build cannot succeed with Turbopack. It should therefore either fall back to
// another bundler, or bail out *before* the compilation phase starts instead of
// crashing in the middle of "Creating an optimized production build".
//
// Deployment is skipped because this is about loading platform specific native
// bindings on the machine running `next build`.
describe('turbopack build with wasm-only swc bindings', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipStart: true,
    skipDeployment: true,
  })

  it('does not fail in the middle of the production build', async () => {
    const { exitCode, cliOutput } = await next.build({
      args: ['--turbopack'],
      env: {
        // Forces `loadBindings()` to use the wasm bindings and makes
        // `loadNative()` throw, like on a host with an incompatible glibc.
        NEXT_TEST_WASM: '1',
        NEXT_TEST_WASM_DIR: path.join(next.testDir, 'wasm-stub'),
        // Avoid conflicting bundler flags with `--turbopack` above.
        IS_WEBPACK_TEST: '',
        NEXT_RSPACK: '',
        NEXT_TEST_USE_RSPACK: '',
      },
    })

    const unsupportedIndex = cliOutput.indexOf(
      'Turbopack is not supported on this platform'
    )

    if (unsupportedIndex === -1) {
      // Next.js fell back to a bundler that works without native bindings.
      expect(cliOutput).not.toContain('Build error occurred')
      expect(exitCode).toBe(0)
    } else {
      // Next.js refused to build with Turbopack. That has to happen before the
      // compilation phase is announced, and the message has to point at the
      // `--webpack` escape hatch.
      expect(cliOutput).toContain('next build --webpack')
      expect(cliOutput.slice(0, unsupportedIndex)).not.toContain(
        'Creating an optimized production build'
      )
    }
  })
})
