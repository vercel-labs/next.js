import { nextTestSetup } from 'e2e-utils'

// Regression test for https://github.com/vercel/next.js/issues/10084
//
// Static route segments whose names contain non-ASCII (UTF-8) characters —
// e.g. `app/тест/page.js` or `pages/пейдж.js` — are unreachable: requesting
// them (raw or percent-encoded) renders the 404 page, both on the server and
// after a client-side `<Link>` navigation. In production `next build` also
// fails while prerendering the app-router page with `InvalidCharacterError`.
// Non-ASCII *dynamic* segment values are unaffected.
describe('non-ASCII page names', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  const APP_PAGE = '/тест'
  const PAGES_PAGE = '/пейдж'

  it.each([
    { router: 'app', path: APP_PAGE, selector: '#app-non-ascii' },
    { router: 'pages', path: PAGES_PAGE, selector: '#pages-non-ascii' },
  ])(
    'serves the $router router page with a non-ASCII name (percent-encoded request)',
    async ({ path, selector }) => {
      const encoded = `/${encodeURIComponent(path.slice(1))}`
      const res = await next.fetch(encoded)
      expect(res.status).toBe(200)

      const $ = await next.render$(encoded)
      expect($(selector).length).toBe(1)
    }
  )

  it.each([
    { router: 'app', path: APP_PAGE, selector: '#app-non-ascii' },
    { router: 'pages', path: PAGES_PAGE, selector: '#pages-non-ascii' },
  ])(
    'serves the $router router page with a non-ASCII name (raw UTF-8 request)',
    async ({ path, selector }) => {
      const res = await next.fetch(path)
      expect(res.status).toBe(200)
      expect(await res.text()).toContain(selector.slice(1))
    }
  )

  it('navigates client-side to a non-ASCII app route', async () => {
    const browser = await next.browser('/')
    await browser.elementByCss('#to-non-ascii').click()
    await browser.waitForElementByCss('#app-non-ascii')
    expect(await browser.elementByCss('#app-non-ascii').text()).toBe(
      'app non-ascii page'
    )
  })
})
