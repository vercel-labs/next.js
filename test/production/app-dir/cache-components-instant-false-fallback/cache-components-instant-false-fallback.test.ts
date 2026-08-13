import { nextTestSetup } from 'e2e-utils'

describe('cache-components-instant-false-fallback', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipStart: true,
  })

  beforeAll(async () => {
    await next.build()
  })

  it('should not emit ISR fallback lifetimes for the empty shell of an `instant = false` route', async () => {
    // The page has no `generateStaticParams` and blocks on `connection()`
    // outside of any Suspense boundary, so its build-time shell is empty.
    expect(
      await next.readFile('.next/server/app/[locale]/products/[slug].html')
    ).toBe('')

    const prerenderManifest = JSON.parse(
      await next.readFile('.next/prerender-manifest.json')
    )

    const route = prerenderManifest.dynamicRoutes['/[locale]/products/[slug]']

    expect(route).toBeDefined()

    // An empty shell is not servable, so the route must be a blocking render
    // instead of an ISR fallback. Otherwise the first runtime render is
    // stored as the ISR fill and reused, with the revalidate/expire window
    // inherited from the parent layout's `use cache` lifetimes
    // (`cacheLife({ revalidate: 60, expire: 600 })`), even though the page
    // itself is strictly per-request.
    expect(route.fallbackRevalidate).toBeUndefined()
    expect(route.fallbackExpire).toBeUndefined()
    expect(route.fallback).toBe(null)
  })
})
