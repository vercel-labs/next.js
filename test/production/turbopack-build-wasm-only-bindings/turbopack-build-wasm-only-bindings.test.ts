import { join } from 'path'
import { nextTestSetup } from 'e2e-utils'

const isTurbopack = !process.env.IS_WEBPACK_TEST && !process.env.NEXT_RSPACK

// On platforms where the native SWC binding cannot be loaded (e.g. Linux with
// glibc < 2.29 such as RHEL 8) Next.js falls back to the wasm bindings, which
// Turbopack does not support. `NEXT_TEST_WASM_DIR` emulates that here.
;(isTurbopack ? describe : describe.skip)(
  'turbopack build with wasm-only bindings',
  () => {
    const { next } = nextTestSetup({
      files: __dirname,
      skipStart: true,
      skipDeployment: true,
    })

    it('fails before the production compile starts when only wasm bindings are available', async () => {
      const { exitCode, cliOutput } = await next.build({
        env: {
          NEXT_TEST_WASM: '1',
          NEXT_TEST_WASM_DIR: join(__dirname, 'wasm-bindings-stub'),
        },
      })

      expect(exitCode).toBe(1)
      expect(cliOutput).toContain('Turbopack is not supported on this platform')
      expect(cliOutput).toContain('next build --webpack')
      // The build must not start compiling before reporting that Turbopack
      // cannot be used on this platform.
      expect(cliOutput).not.toContain('Creating an optimized production build')
    })
  }
)
