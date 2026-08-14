/* eslint-env jest */
import fs from 'fs'
import os from 'os'
import path from 'path'

// `next/dist/compiled/webpack/webpack` only ships a type-only namespace, so the
// callable value is picked up via `require`.
const { webpack } = require('next/dist/compiled/webpack/webpack') as {
  webpack: (
    config: any,
    callback: (err: Error | null, stats: any) => void
  ) => void
}

// The bundled `loader-runner` and `enhanced-resolve` run
// `PATH_QUERY_FRAGMENT_REGEXP` on every module request. V8 throws
// `RangeError: Maximum call stack size exceeded` from `RegExp.exec` once the
// request is long enough, which breaks modules inlining a big asset such as
// Emscripten `SINGLE_FILE=1` output using
// `new URL("data:application/wasm;base64,…", import.meta.url)`. In `next dev`
// this surfaced as an unhandled rejection and the request never resolved.
// x-ref: https://github.com/vercel/next.js/issues/97364
const DATA_URI_PREFIX = 'data:application/wasm;base64,'
const DATA_URI_LENGTH = 13_280_481

// Rspack does not use the bundled webpack resolver.
const describeMaybe = process.env.NEXT_RSPACK ? describe.skip : describe

describeMaybe('bundled webpack with a large data: URI request', () => {
  let dir: string

  beforeAll(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'large-data-uri-request-'))
    const dataUri =
      DATA_URI_PREFIX + 'A'.repeat(DATA_URI_LENGTH - DATA_URI_PREFIX.length)
    fs.writeFileSync(
      path.join(dir, 'index.mjs'),
      `export const wasmUrl = new URL(${JSON.stringify(
        dataUri
      )}, import.meta.url).href\n`
    )
  })

  afterAll(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('compiles without a RegExp stack overflow', async () => {
    const stats = await new Promise<any>((resolve, reject) => {
      webpack(
        {
          mode: 'development',
          target: 'node',
          entry: path.join(dir, 'index.mjs'),
          output: { path: path.join(dir, 'out') },
        },
        (err: Error | null, stats: any) => {
          if (err) return reject(err)
          resolve(stats)
        }
      )
    })

    // Without the fix this is
    // ["Module not found: RangeError: Maximum call stack size exceeded"]
    expect(
      stats.compilation.errors.map((error: Error) => error.message)
    ).toEqual([])
  }, 180_000)
})
