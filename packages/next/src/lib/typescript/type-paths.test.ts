/**
 * Regression tests for the dev-types filter used by `runTypeCheck`:
 *
 *   const devTypesDir = getDevTypesPath(baseDir, distDir)
 *   fileNames.filter((fileName) => !fileName.startsWith(devTypesDir))
 *
 * `fileNames` comes from TypeScript's config parser, which always emits POSIX
 * separators, so `getDevTypesPath` has to return a POSIX path as well.
 * On Windows it used to return backslashes, making the filter a no-op and
 * letting `.next/dev/types/*` into the `next build` type-check program.
 * See https://github.com/vercel/next.js/issues/97216
 */

function loadTypePaths(
  pathImpl: typeof import('path')
): typeof import('./type-paths') {
  let typePaths: typeof import('./type-paths')
  jest.isolateModules(() => {
    jest.doMock('path', () => pathImpl)
    typePaths = require('./type-paths')
  })
  jest.dontMock('path')
  return typePaths!
}

describe('getDevTypesPath', () => {
  const originalNodeEnv = process.env.NODE_ENV

  afterEach(() => {
    // @ts-expect-error -- NODE_ENV is read-only in the types
    process.env.NODE_ENV = originalNodeEnv
    jest.resetModules()
  })

  it('returns null in development', () => {
    // @ts-expect-error -- NODE_ENV is read-only in the types
    process.env.NODE_ENV = 'development'
    const { getDevTypesPath } = loadTypePaths(require('path').posix)
    expect(getDevTypesPath('/project', '.next')).toBeNull()
  })

  it('matches tsconfig file names on posix', () => {
    const { getDevTypesPath } = loadTypePaths(require('path').posix)
    const devTypesDir = getDevTypesPath('/project', '.next')
    expect(devTypesDir).toBe('/project/.next/dev/types')
    expect(
      '/project/.next/dev/types/validator.ts'.startsWith(devTypesDir!)
    ).toBe(true)
  })

  it('matches tsconfig file names on win32', () => {
    const { getDevTypesPath } = loadTypePaths(require('path').win32)
    // TypeScript's config parser emits forward slashes on every platform, so
    // the returned path has to be comparable to those file names.
    const devTypesDir = getDevTypesPath('C:\\project', '.next')
    expect(
      'C:/project/.next/dev/types/validator.ts'.startsWith(devTypesDir!)
    ).toBe(true)
    expect(devTypesDir).not.toContain('\\')
  })
})
