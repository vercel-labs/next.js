import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import FileSystemCache from './file-system-cache'
import { nodeFs } from '../node-fs-methods'
import { CachedRouteKind, IncrementalCacheKind } from '../../response-cache'

describe('FileSystemCache redirects with a small memory cache', () => {
  let serverDistDir: string

  beforeAll(async () => {
    serverDistDir = await fs.mkdtemp(path.join(tmpdir(), 'fs-cache-redirect-'))
  })

  // A revalidation that returns `redirect` from `getStaticProps` is only ever
  // stored in the in-memory cache, so with a small `cacheMaxMemorySize`
  // (formerly `experimental.isrMemoryCacheSize`) the redirect entry is dropped
  // and the previously prerendered page keeps being served.
  // x-ref: https://github.com/vercel/next.js/issues/39704
  it('should return the revalidated redirect instead of the stale page', async () => {
    const fsCache = new FileSystemCache({
      _requestHeaders: {},
      flushToDisk: true,
      fs: nodeFs,
      serverDistDir,
      revalidatedTags: [],
      // Smaller than the redirect entry, matching the reported repro.
      maxMemoryCacheSize: 50,
    })

    // Initial prerender of /test, written to disk.
    await fsCache.set(
      '/test',
      {
        kind: CachedRouteKind.PAGES,
        html: '<p>hello from the prerendered page</p>',
        pageData: { redirect: false },
        headers: undefined,
        status: 200,
      },
      {}
    )

    // Revalidation now returns a redirect from `getStaticProps`.
    await fsCache.set(
      '/test',
      {
        kind: CachedRouteKind.REDIRECT,
        props: {
          __N_REDIRECT: '/',
          __N_REDIRECT_STATUS: 307,
        },
      },
      {}
    )

    const entry = await fsCache.get('/test', {
      kind: IncrementalCacheKind.PAGES,
      isFallback: false,
    })

    expect(entry?.value).toEqual({
      kind: CachedRouteKind.REDIRECT,
      props: {
        __N_REDIRECT: '/',
        __N_REDIRECT_STATUS: 307,
      },
    })
  })
})
