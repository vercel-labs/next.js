import { nextTestSetup, type Playwright } from 'e2e-utils'
import { retry } from 'next-test-utils'

// Regression test for https://github.com/vercel/next.js/issues/98172
//
// The proxy 308-redirects unprefixed pathnames to the default locale
// (/about -> /en/about). A <Link> navigation that gets redirected must still
// scroll the destination page to the top, just like a <Link> that points at
// the redirect destination directly.
describe('scroll to top after a proxy redirect (#98172)', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  const getScrollTop = (browser: Playwright) =>
    browser.eval<number>('document.documentElement.scrollTop')

  async function scrollLinksIntoView(browser: Playwright) {
    await browser.eval('window.scrollTo(0, document.body.scrollHeight)')
    await retry(async () => {
      expect(await getScrollTop(browser)).toBeGreaterThan(1000)
    })
  }

  async function waitForAboutPage(browser: Playwright) {
    await retry(async () => {
      expect(await browser.elementById('about').text()).toBe('about: en')
      expect(new URL(await browser.url()).pathname).toBe('/en/about')
    })
  }

  it('scrolls to the top when the navigation is redirected by the proxy', async () => {
    const browser = await next.browser('/en')
    await scrollLinksIntoView(browser)

    await browser.elementById('link-redirected').click()
    await waitForAboutPage(browser)

    await retry(async () => {
      expect(await getScrollTop(browser)).toBe(0)
    })
  })

  it('scrolls to the top when the same destination is not redirected', async () => {
    const browser = await next.browser('/en')
    await scrollLinksIntoView(browser)

    await browser.elementById('link-direct').click()
    await waitForAboutPage(browser)

    await retry(async () => {
      expect(await getScrollTop(browser)).toBe(0)
    })
  })
})
