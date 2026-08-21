// Simulates the Windows code path of packages/next/src/build/webpack/loaders/next-app-loader
// without needing Windows, by using path.win32.
import path from 'path'

const APP_DIR_ALIAS = 'private-next-app-dir'
const appDir = 'C:\\proj\\app'
const sep = path.win32.sep

// 1) How pagePath is produced for app entries (build/route-discovery.ts createPagesMapping):
//      normalizePathSep(join(APP_DIR_ALIAS, pagePath))
const normalizePathSep = (p) => p.replace(/\\/g, '/')
const winRelativePagePath = 'api\\nested\\route.ts' // what recursiveReadDir yields on Windows
const pagePath = normalizePathSep(path.win32.join(APP_DIR_ALIAS, winRelativePagePath))
console.log('pagePath passed to the loader on Windows:', JSON.stringify(pagePath))

// 2) create-app-route-code.ts line ~36 (the regex the issue points at)
const routePath = pagePath.replace(/[\\/]/, '/')
console.log('routePath (current canary regex, no /g):', JSON.stringify(routePath))

// 3) resolveAppRoute === createAbsolutePath in next-app-loader/index.ts
const createAbsolutePath = (dir, p) =>
  p.replace(/\//g, sep).replace(/^private-next-app-dir/, dir)
console.log('resolveAppRoute(routePath):', JSON.stringify(createAbsolutePath(appDir, routePath)))

// 4) Hypothetical: even if pagePath *did* arrive with backslashes, the result is identical,
//    because createAbsolutePath maps every "/" back to path.sep ("\\" on Windows).
const backslashPagePath = 'private-next-app-dir\\api\\nested\\route.ts'
const badRoutePath = backslashPagePath.replace(/[\\/]/, '/')
console.log('\nhypothetical backslash pagePath:', JSON.stringify(backslashPagePath))
console.log('  routePath (no /g):', JSON.stringify(badRoutePath))
console.log('  resolveAppRoute  :', JSON.stringify(createAbsolutePath(appDir, badRoutePath)))
console.log('  with normalizePathSep fix:', JSON.stringify(createAbsolutePath(appDir, normalizePathSep(backslashPagePath))))
console.log('\nresolveAppRoute always returns a string, so the "Invariant: could not resolve page path" throw is unreachable here.')
