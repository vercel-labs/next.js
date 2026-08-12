import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'
import { createRouterAct } from 'router-act'

describe('optimistic routing - rewritten URL match regression', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
  })

  if (isNextDev) {
    // Optimistic routing is a production-build feature; in dev mode the
    // router does not have complete information about which routes exist,
    // so prediction is disabled.
    test('skipped in dev mode', () => {})
    return
  }

  it('does not predict a route pattern for a URL owned by a rewrite', async () => {
    let act: ReturnType<typeof createRouterAct>
    const browser = await next.browser('/en', {
      beforePageLoad(page) {
        act = createRouterAct(page)
      },
    })
    expect(await browser.elementById('client-locale').text()).toBe('en')

    // Prefetching /de teaches the router the one-part /[locale] pattern.
    await act(async () => {
      const toggle = await browser.elementByCss(
        'input[data-link-accordion="/de"]'
      )
      await toggle.click()
    })

    // Reveal the click target. It's prefetch={false}, so the router has no
    // cache entry for /team and must either predict it or ask the server.
    await act(async () => {
      const toggle = await browser.elementByCss(
        'input[data-link-accordion="/team"]'
      )
      await toggle.click()
    }, 'no-requests')

    // /team is rewritten to /en/team, so it does not route through the
    // learned /[locale] pattern at all. With the bug, the router applies
    // that pattern anyway: it binds locale="team" and renders the cached
    // /[locale] home page for /team — without even issuing a request, so
    // the wrong page and the bogus param are never corrected.
    await browser.elementByCss('a[href="/team"]').click()

    await retry(async () => {
      expect(await browser.elementById('client-locale').text()).toBe('en')
      expect(await browser.elementById('team-page').text()).toBe(
        'Team page: en'
      )
    })
  })
})
