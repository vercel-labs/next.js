import { nextTestSetup } from 'e2e-utils'
import type * as Playwright from 'playwright'
import { createRouterAct } from 'router-act'

describe('segment cache - prerendered dynamic params with partialPrefetching', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
  })

  if (isNextDev) {
    // Depends on build-time prerenders, which don't exist in dev.
    it('is skipped', () => {})
    return
  }

  // Regression test: with the global `partialPrefetching` config, prefetching a
  // link to a route with a dynamic param whose value comes from
  // generateStaticParams (so the page is prerendered for that URL) does not
  // make the navigation committable. On click the router has to issue a
  // navigation-time request before it can render anything, and while that
  // request is in flight nothing commits — which is what makes such a
  // navigation fall back to a full document load when the request can't be
  // served.
  //
  // The control below shows the same fixture committing a prefetched
  // navigation for a route with no dynamic param.
  it('commits a prefetched navigation to a prerendered dynamic-param route', async () => {
    let page: Playwright.Page
    const browser = await next.browser('/', {
      beforePageLoad(p: Playwright.Page) {
        page = p
      },
    })
    const act = createRouterAct(page, { includeAppShellRequests: true })

    // Reveal the link to prefetch /items/alpha. The slug is prerendered, so
    // everything needed to render the page is available to the prefetch.
    await act(async () => {
      await browser
        .elementByCss('input[data-link-accordion="/items/alpha"]')
        .click()
    })

    await act(async () => {
      await act(async () => {
        await browser.elementByCss('a[href="/items/alpha"]').click()

        // Any request issued by the click is blocked here, so this only passes
        // if the navigation committed from prefetched data.
        expect(await browser.elementById('item').text()).toBe('Item: alpha')
      }, 'block')
    })

    expect(await browser.elementById('item').text()).toBe('Item: alpha')
  })

  it('commits a prefetched navigation to a route without dynamic params', async () => {
    let page: Playwright.Page
    const browser = await next.browser('/', {
      beforePageLoad(p: Playwright.Page) {
        page = p
      },
    })
    const act = createRouterAct(page, { includeAppShellRequests: true })

    await act(async () => {
      await browser
        .elementByCss('input[data-link-accordion="/static-page"]')
        .click()
    })

    await act(async () => {
      await act(async () => {
        await browser.elementByCss('a[href="/static-page"]').click()
        expect(await browser.elementById('static-page').text()).toBe(
          'Static page'
        )
      }, 'block')
    })

    expect(await browser.elementById('static-page').text()).toBe('Static page')
  })
})
