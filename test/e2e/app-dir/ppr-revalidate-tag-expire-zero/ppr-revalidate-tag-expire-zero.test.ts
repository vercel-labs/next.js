import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('ppr-revalidate-tag-expire-zero', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (isNextDev) {
    it('skipped in dev', () => {})
    return
  }

  it('keeps serving the route shell of a prerendered dynamic segment after revalidateTag with expire 0', async () => {
    // Baseline: the prerendered path serves a complete route shell, i.e. the
    // cached content is part of the static HTML, and the route's root Suspense
    // fallback is not used.
    let $ = await next.render$('/a')
    expect($('#title').text()).toBe('PRODUCT A')
    expect($('#title').closest('[hidden]').length).toBe(0)
    expect($('#page-skeleton').length).toBe(0)

    // Purge the tag that the cached function feeding the shell is tagged with.
    const response = await next.fetch('/api/revalidate')
    expect(response.status).toBe(200)

    // The route shell must be regenerated with the fresh cache entry. It must
    // not degrade to the fallback shell of `/[slug]`, which would relegate all
    // content to streamed segments.
    await retry(async () => {
      $ = await next.render$('/a')
      expect($('#page-skeleton').length).toBe(0)
      expect($('#title').closest('[hidden]').length).toBe(0)
      expect($('#title').text()).toBe('PRODUCT A')
    }, 10_000)
  })
})
