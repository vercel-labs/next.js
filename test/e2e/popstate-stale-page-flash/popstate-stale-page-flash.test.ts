import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

// https://github.com/vercel/next.js/issues/10465
describe('popstate navigation to a page with getInitialProps', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should not keep rendering the previous page under the new url', async () => {
    const browser = await next.browser('/')
    expect(await browser.elementByCss('#page').text()).toBe('index')

    await browser.elementByCss('#to-data').click()
    await retry(async () => {
      expect(await browser.elementByCss('#page').text()).toBe('data')
    })

    await browser.eval(() => window.history.back())
    await retry(async () => {
      expect(await browser.elementByCss('#page').text()).toBe('index')
    })

    // Record (pathname, rendered page) pairs on every frame so we can tell
    // whether the previous page stayed on screen while the url already
    // pointed at the new one.
    await browser.eval(() => {
      const samples: string[] = []
      ;(window as any).__samples = samples
      const sample = () => {
        const page = document.getElementById('page')
        samples.push(`${location.pathname} ${page ? page.textContent : 'none'}`)
        requestAnimationFrame(sample)
      }
      sample()
    })

    await browser.eval(() => window.history.forward())
    await retry(async () => {
      expect(await browser.elementByCss('#page').text()).toBe('data')
    })

    const samples: string[] = await browser.eval(
      () => (window as any).__samples
    )
    // A client-side popstate navigation keeps the document (and therefore the
    // recorded samples) alive.
    expect(samples.length).toBeGreaterThan(0)

    // While `getInitialProps` of `/data` is pending, the url is already
    // `/data` but the previous page is still the rendered output. On mobile
    // browsers that frame is what is shown after the swipe gesture snapshot
    // is dropped, which is the reported flash of the previous page.
    expect(samples.filter((sample) => sample === '/data index')).toEqual([])
  })
})
