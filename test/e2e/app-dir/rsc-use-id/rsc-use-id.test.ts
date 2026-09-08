import { nextTestSetup, type Playwright } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('app-dir - useId in Server Components', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  async function getServerIds(browser: Playwright): Promise<string[]> {
    return browser.eval(
      `Array.from(document.querySelectorAll('[data-server-id]')).map((el) => el.id)`
    )
  }

  it('should generate unique ids on a hard load', async () => {
    const browser = await next.browser('/')
    const ids = await getServerIds(browser)
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })

  it('should not reuse an id from a persisted layout after a client-side navigation', async () => {
    const browser = await next.browser('/other')

    await retry(async () => {
      expect(await getServerIds(browser)).toHaveLength(2)
    })

    await browser.elementById('to-home').click()

    await retry(async () => {
      expect(
        await browser.eval(
          `document.querySelector('[data-server-id="home-page"]') !== null`
        )
      ).toBe(true)
    })

    const ids = await getServerIds(browser)
    expect(ids).toHaveLength(2)
    // The root layout is not re-rendered for this navigation, so the id it
    // already put in the DOM must not be handed out again to the new page.
    expect(new Set(ids).size).toBe(2)
  })
})
