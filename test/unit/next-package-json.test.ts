import * as semver from 'semver'

const nextPackage = require('../../packages/next/package.json')

describe('next package.json', () => {
  it('does not allow sharp versions affected by GHSA-f88m-g3jw-g9cj', () => {
    const sharpRange = nextPackage.optionalDependencies.sharp

    expect(semver.intersects(sharpRange, '<0.35.0')).toBe(false)
  })
})
