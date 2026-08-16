import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'
import type * as Playwright from 'playwright'
import { createRouterAct } from 'router-act'

describe('partial prefetching config', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
  })
  if (isNextDev) {
    it('is skipped', () => {})
    return
  }

  it('does not prefetch dynamic data, even when <Link prefetch={true}>', async () => {
    let page: Playwright.Page
    const browser = await next.browser('/', {
      beforePageLoad(p: Playwright.Page) {
        page = p
      },
    })
    const act = createRouterAct(page)

    // Reveal the link to trigger its prefetch. The Link has prefetch={true},
    // and the target page has no per-segment config, so the behavior is
    // determined by the global Next.js config. Because Partial Prefetching is
    // enabled, the prefetch should include static content, but NOT
    // dynamic data.
    await act(async () => {
      const linkToggle = await browser.elementByCss(
        'input[data-link-accordion="/target-page"]'
      )
      await linkToggle.click()
    }, [
      { includes: 'Static content' },
      { includes: 'Dynamic content', block: 'reject' },
    ])
  })

  it('re-fetches dynamic content on navigation after an initial HTML load', async () => {
    let page: Playwright.Page
    // Start directly at /target-page (a full HTML load, not a client-side
    // navigation). The connection()-gated dynamic content renders once during
    // this load; the resolved value is what gets seeded into the client cache.
    const browser = await next.browser('/target-page', {
      beforePageLoad(p: Playwright.Page) {
        page = p
      },
    })
    const act = createRouterAct(page)

    // Wait for the dynamic content to stream in from the initial HTML load.
    await retry(async () => {
      expect(await browser.elementById('dynamic-content').text()).toContain(
        'Dynamic content'
      )
    })
    const firstValue = await browser.elementById('dynamic-content').text()

    // Navigate to home via the always-present (prefetch=false) layout link.
    await browser.elementByCss('a[href="/"]').click()
    await retry(async () => {
      expect(await browser.elementByCss('h1').text()).toBe('Home')
    })

    // Reveal the link (prefetch={true}) and navigate back to /target-page.
    // With Partial Prefetching the prefetch must not include dynamic data, so
    // the navigation has to issue a request that re-renders the
    // connection()-gated content rather than serving it stale from the bfcache.
    await act(
      async () => {
        await browser
          .elementByCss('input[data-link-accordion="/target-page"]')
          .click()
        await browser.elementByCss('a[href="/target-page"]').click()
      },
      { includes: 'Dynamic content' }
    )

    const secondValue = await browser.elementById('dynamic-content').text()

    // connection() means "always run per request", so the value must change.
    // If it's unchanged, the stale dynamic data from the initial HTML load was
    // incorrectly served from the bfcache via the Full prefetch's upgrade.
    expect(secondValue).not.toBe(firstValue)
  })

  it('does not embed a runtime prefetch when the segment exports prefetch = "force-disabled"', async () => {
    // /force-disabled-page opts out of Partial Prefetching with
    // `export const prefetch = 'force-disabled'`, which must override the
    // app-level `partialPrefetching: true` config for this route.
    //
    // The request below is a plain document request: no RSC header, no
    // Next-Router-Prefetch header, and no <Link> involved. The cached shell
    // therefore has to appear exactly twice in the response: once in the HTML
    // markup and once in the inlined Flight payload of the dynamic render. A
    // third copy means an additional runtime prefetch render was spawned and
    // embedded in the payload, despite the route opting out.
    const html = await next.render('/force-disabled-page')

    expect(html).toContain('FORCE_DISABLED_SHELL_MARKER')
    const shellCopies = html.split('FORCE_DISABLED_SHELL_MARKER').length - 1
    expect(shellCopies).toBe(2)
  })
})
