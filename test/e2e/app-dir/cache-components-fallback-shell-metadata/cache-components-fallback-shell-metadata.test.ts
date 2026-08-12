import { isNextDev, nextTestSetup } from 'e2e-utils'

describe('cache-components - dynamic generateMetadata in fallback shells', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    skipStart: true,
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  if (isNextDev) {
    it('is only meaningful for production builds', () => {})
    return
  }

  // Fallback shells are allowed to be empty/blocking (`allowEmptyStaticShell`
  // is `true` for them), so `generateMetadata()` reading a hanging `params`
  // promise must not fail the build for those shells.
  it('does not error the build when generateMetadata reads params of a fallback shell', async () => {
    try {
      await next.build()
    } catch (e) {
      console.error('Expected the build to succeed, but it failed.')
      throw e
    }

    expect(next.cliOutput).not.toContain(
      'Next.js encountered uncached or runtime data in `generateMetadata()`'
    )
    expect(next.cliOutput).not.toContain('Export encountered')

    const prerenderManifest = JSON.parse(
      await next.readFile('.next/prerender-manifest.json')
    )

    expect(Object.keys(prerenderManifest.routes)).toContain('/x/y')
    expect(Object.keys(prerenderManifest.dynamicRoutes)).toContain('/[a]/[b]')
  })
})
