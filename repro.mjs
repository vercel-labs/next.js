// Repro for https://github.com/vercel/next.js/issues/75960
// Drives the real, shipped makeExternalHandler() from next/dist/build/handle-externals.js
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

const require = createRequire(import.meta.url)
const dir = process.cwd()
const { makeExternalHandler } = require('next/dist/build/handle-externals.js')
console.log('next version:', require('next/package.json').version)

// A minimal async resolver with the shape webpack gives Next.js:
// (options) => (context, request) => Promise<[resolvedPath, isEsm]>
const getResolve = () => async (context, request) => {
  await new Promise((r) => setImmediate(r)) // resolvers are async I/O
  try {
    const res = fs.realpathSync(require.resolve(request, { paths: [context] }))
    return [res, false]
  } catch {
    return [null, false]
  }
}

const config = {
  experimental: { esmExternals: true },
  bundlePagesRouterDependencies: false,
}

function newHandler() {
  return makeExternalHandler({
    config,
    optOutBundlingPackages: [],
    optOutBundlingPackageRegex: /node_modules[/\\]__never__[/\\]/,
    transpiledPackages: ['mylib'], // next.config.js transpilePackages
    dir,
  })
}

const call = (h) => h(dir, 'mylib', 'commonjs', null, getResolve)
const label = (r) =>
  r === undefined ? 'undefined  => BUNDLED/transpiled (correct)' : `${r}  => EXTERNALIZED (wrong)`

console.log('resolved real path:', fs.realpathSync(require.resolve('mylib')))

// 1. Sequential: second call sees the fully populated map.
const seq = newHandler()
console.log('\n[sequential]')
console.log('  call #1:', label(await call(seq)))
console.log('  call #2:', label(await call(seq)))

// 2. Concurrent: webpack calls the handler for many modules at once.
//    Call #2 observes `resolvedExternalPackageDirs` as a still-empty Map,
//    because it is assigned before the awaits that fill it.
const par = newHandler()
console.log('\n[concurrent]')
const [a, b] = await Promise.all([call(par), call(par)])
console.log('  call #1:', label(a))
console.log('  call #2:', label(b))

if (b !== undefined) {
  console.log('\nRACE REPRODUCED: same input, different externals decision.')
  process.exitCode = 1
}
