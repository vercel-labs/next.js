/* eslint-env jest */
import fs from 'fs'
import os from 'os'
import path from 'path'

// Regression test for https://github.com/vercel/next.js/issues/97365
//
// Next.js vendors webpack together with its resolver and loader-runner in
// `next/dist/compiled/webpack`. Older vendored copies run a backtracking
// path/query/fragment regexp on *every* module request, so V8 throws
// `RangeError: Maximum call stack size exceeded` as soon as a request is bigger
// than the V8 RegExp stack limit (~8.39M characters). This happens for real
// packages that inline a multi-megabyte wasm binary via
// `new URL("data:application/wasm;base64,...", import.meta.url)`. In `next dev`
// the RangeError escaped as an unhandledRejection, so the page request never
// resolved and no error overlay was shown.
const { webpack } = require('next/dist/compiled/webpack/webpack')

// 9 MiB, comfortably above the V8 RegExp stack limit observed on Node 22/24.
const HUGE_DATA_URI_LENGTH = 9 * 1024 * 1024

function createFixture(base64Length: number): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'next-large-request-'))
  fs.writeFileSync(
    path.join(dir, 'big.mjs'),
    `export const wasmUrl = new URL("data:application/wasm;base64,${'A'.repeat(
      base64Length
    )}", import.meta.url).href\n`
  )
  fs.writeFileSync(
    path.join(dir, 'index.mjs'),
    `import { wasmUrl } from "./big.mjs"\nexport default wasmUrl\n`
  )
  return dir
}

function compile(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    webpack({
      mode: 'development',
      target: 'node',
      entry: path.join(dir, 'index.mjs'),
      output: { path: path.join(dir, 'out') },
    }).run((err: Error | null, stats: any) => {
      if (err) return reject(err)
      resolve(
        stats.compilation.errors.map((error: Error) => String(error.message))
      )
    })
  })
}

describe('vendored webpack with a very large module request', () => {
  it('compiles a small inlined data: URI module', async () => {
    const errors = await compile(createFixture(1024))
    expect(errors).toEqual([])
  })

  it('compiles a module request larger than the V8 RegExp stack limit', async () => {
    const errors = await compile(createFixture(HUGE_DATA_URI_LENGTH))
    expect(errors.join('\n')).not.toContain('Maximum call stack size exceeded')
    expect(errors).toEqual([])
  }, 120_000)
})
