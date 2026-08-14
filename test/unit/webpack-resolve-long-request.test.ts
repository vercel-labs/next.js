/**
 * @jest-environment node
 */
/* eslint-env jest */
import { webpack } from 'next/dist/compiled/webpack/webpack'

// Regression test for https://github.com/vercel/next.js/issues/97371
//
// The `enhanced-resolve` copy vendored into
// `next/dist/compiled/webpack/bundle5.js` runs `PATH_QUERY_FRAGMENT_REGEXP`
// on every module request. V8's RegExp engine overflows its own stack once the
// subject string reaches 2 ** 23 characters, so a long request (e.g. an
// Emscripten `SINGLE_FILE=1` worker containing
// `new URL("data:application/wasm;base64,…", import.meta.url)`) makes the
// resolver throw a synchronous `RangeError: Maximum call stack size exceeded`
// instead of calling back. In `next dev` that surfaces as an
// `unhandledRejection` and the request never resolves.
describe('bundled webpack resolver', () => {
  it('does not throw a RangeError for requests larger than V8s RegExp stack limit', async () => {
    const compiler = webpack({ mode: 'development', context: __dirname })
    const resolver = compiler.resolverFactory.get('normal', {})

    // Anything >= 2 ** 23 characters overflows V8's RegExp stack.
    const longRequest =
      'data:application/wasm;base64,' + 'A'.repeat(2 ** 23) + '=='

    const resolveError = await new Promise<Error | null | undefined>(
      (resolve, reject) => {
        try {
          resolver.resolve({}, __dirname, longRequest, {}, (err: Error) => {
            resolve(err)
          })
        } catch (err) {
          // Before the fix the resolver threw synchronously here.
          reject(err)
        }
      }
    )

    // An unresolvable request is expected to be reported through the callback.
    expect(resolveError).toBeInstanceOf(Error)
    expect(resolveError!.message).not.toContain(
      'Maximum call stack size exceeded'
    )
  })
})
