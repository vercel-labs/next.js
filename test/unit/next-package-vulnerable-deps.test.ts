/* eslint-env jest */
import { join } from 'path'
import * as semver from 'semver'

// Regression test for https://github.com/vercel/next.js/issues/97011
// `npm audit` on a fresh Next.js app reported high severity advisories because
// `next` declared vulnerable ranges for these dependencies.
// Each entry is the lowest version that is not affected by the advisory.
const MINIMUM_SAFE_VERSIONS = {
  // GHSA-r28c-9q8g-f849 (and related postcss advisories)
  postcss: '8.5.23',
  // GHSA-f88m-g3jw-g9cj (bundled libvips)
  sharp: '0.35.0',
} as const

const nextPackageJson = require(
  join(__dirname, '../../packages/next/package.json')
) as {
  dependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

describe('next package.json security-sensitive dependency ranges', () => {
  for (const [name, minimumSafeVersion] of Object.entries(
    MINIMUM_SAFE_VERSIONS
  )) {
    it(`declares \`${name}\` at >= ${minimumSafeVersion}`, () => {
      const range =
        nextPackageJson.dependencies?.[name] ??
        nextPackageJson.optionalDependencies?.[name]

      if (typeof range !== 'string') {
        throw new Error(`Expected next to declare a "${name}" dependency.`)
      }

      // The lowest version the declared range can install must already contain
      // the security fix, otherwise `npm audit` flags every Next.js install.
      const lowestAllowedVersion = semver.minVersion(range)!.version

      expect({
        name,
        range,
        lowestAllowedVersion,
        vulnerable: semver.lt(lowestAllowedVersion, minimumSafeVersion),
      }).toEqual({
        name,
        range,
        lowestAllowedVersion,
        vulnerable: false,
      })
    })
  }
})
