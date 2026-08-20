/* eslint-env jest */
import { join } from 'path'

// https://github.com/vercel/next.js/issues/38898
// `getSupportedBrowsers()` expands `current node` into the exact running Node.js
// version (e.g. `node 24.17.0`). That resolved list is handed to autoprefixer /
// postcss-preset-env, which parses it again with the same bundled browserslist.
// When the bundled `node-releases` data does not know the running Node.js
// release, that second parse throws
// `BrowserslistError: Unknown version <version> of Node.js` and the build fails
// while compiling CSS.
describe('getSupportedBrowsers with `current node` in .browserslistrc', () => {
  const fixtureDir = join(__dirname, 'fixtures', 'browserslist-current-node')

  function resolveSupportedBrowsers(nodeVersion: string): {
    browsers: string[]
    reparse: () => string[]
  } {
    const originalNodeVersion = process.versions.node
    Object.defineProperty(process.versions, 'node', {
      value: nodeVersion,
      configurable: true,
    })

    try {
      let result: { browsers: string[]; reparse: () => string[] }

      jest.isolateModules(() => {
        const browserslist = require('next/dist/compiled/browserslist') as (
          queries: string[]
        ) => string[]
        const { getSupportedBrowsers } =
          require('next/dist/build/get-supported-browsers') as {
            getSupportedBrowsers: (
              dir: string,
              isDevelopment: boolean
            ) => string[]
          }

        const browsers = getSupportedBrowsers(fixtureDir, false)
        result = { browsers, reparse: () => browserslist(browsers) }
      })

      return result!
    } finally {
      Object.defineProperty(process.versions, 'node', {
        value: originalNodeVersion,
        configurable: true,
      })
    }
  }

  it('resolves to browsers that browserslist can parse on the running Node.js version', () => {
    const { reparse } = resolveSupportedBrowsers(process.versions.node)

    expect(reparse).not.toThrow()
  })

  it('resolves to browsers that browserslist can parse on a Node.js version missing from the bundled release data', () => {
    const { browsers, reparse } = resolveSupportedBrowsers('99.0.0')

    expect(browsers.length).toBeGreaterThan(0)
    expect(reparse).not.toThrow()
  })
})
