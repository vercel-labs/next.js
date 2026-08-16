import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

// Regression test for GitHub #97417: with Cache Components + `partialPrefetching`,
// the second client-side navigation into a dynamic route kept the `<title>` of
// the previously visited instance of that route (`/coin/ethereum` showed
// "Bitcoin"). The URL and the page content were correct, only the document
// title lagged one visit behind.
describe('metadata-dynamic-route-soft-nav', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
  })

  if (isNextDev) {
    // The regression only affected production builds.
    test('disabled in development', () => {})
    return
  }

  it('updates the title when navigating between instances of a dynamic route', async () => {
    const browser = await next.browser('/')

    expect(await browser.eval(() => document.title)).toBe('Home Default')

    // First visit of the dynamic route: this one was always correct.
    await browser.elementById('link-bitcoin').click()
    await browser.waitForElementByCss('#coin')
    await retry(async () => {
      expect(await browser.eval(() => document.title)).toBe('Bitcoin | Site')
    })

    await browser.elementById('link-home').click()
    await browser.waitForElementByCss('#home')
    await retry(async () => {
      expect(await browser.eval(() => document.title)).toBe('Home Default')
    })

    // Second visit, different param: the title must be the new page's title,
    // not the stale "Bitcoin | Site" of the previous visit.
    await browser.elementById('link-ethereum').click()
    await browser.waitForElementByCss('#coin')
    expect(await browser.elementByCss('#coin').text()).toBe('ethereum')
    await retry(async () => {
      expect(await browser.eval(() => document.title)).toBe('Ethereum | Site')
    })
  })
})
