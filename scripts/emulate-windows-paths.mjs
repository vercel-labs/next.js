/**
 * Only needed on Linux / macOS.
 *
 * The bug in vercel/next.js#53562 is caused by Windows path separators, so it
 * cannot happen on POSIX hosts. This script rewrites the two `path.relative()`
 * calls that compute the client-reference manifest keys inside the *installed*
 * Next.js build to `path.win32.relative()`, i.e. it makes Next.js compute the
 * exact same module keys it computes on Windows. Nothing else is changed.
 *
 *   - node_modules/next/dist/build/webpack/plugins/flight-client-entry-plugin.js
 *       -> key written into `pluginState.edgeSsrModules`
 *   - node_modules/next/dist/build/webpack/plugins/flight-manifest-plugin.js
 *       -> key read from `pluginState.edgeSsrModules` when building
 *          `edgeSSRModuleMapping`
 *
 * Run `node scripts/emulate-windows-paths.mjs` after `pnpm install`, then
 * `pnpm dev` and open http://localhost:3000.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(
  path.join(process.cwd(), 'apps/web/package.json')
)
const nextPkg = require.resolve('next/package.json')
const plugins = path.join(
  path.dirname(nextPkg),
  'dist/build/webpack/plugins'
)

const edits = [
  {
    file: path.join(plugins, 'flight-client-entry-plugin.js'),
    from: 'let ssrNamedModuleId = _path.default.relative(compiler.context, modResource)',
    to: 'let ssrNamedModuleId = _path.default.win32.relative(compiler.context, modResource)',
  },
  {
    file: path.join(plugins, 'flight-manifest-plugin.js'),
    from: 'let ssrNamedModuleId = (0, _path.relative)(context,',
    to: "let ssrNamedModuleId = require('path').win32.relative(context,",
  },
]

for (const { file, from, to } of edits) {
  const src = fs.readFileSync(file, 'utf8')
  if (src.includes(to)) {
    console.log(`already patched: ${file}`)
    continue
  }
  if (!src.includes(from)) {
    throw new Error(
      `could not find the expected source in ${file}\nlooked for: ${from}`
    )
  }
  fs.writeFileSync(file, src.replace(from, to))
  console.log(`patched: ${file}`)
}

console.log('\nnow run: pnpm dev  ->  http://localhost:3000')
