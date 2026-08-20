import { nextTestSetup } from 'e2e-utils'

describe('Script component with crossOrigin props', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should be set crossOrigin also in preload link tag', async () => {
    const browser = await next.browser('/')

    const crossorigin = await browser
      .elementByCss('link[href="https://code.jquery.com/jquery-3.7.1.min.js"]')
      .getAttribute('crossorigin')

    expect(crossorigin).toBe('use-credentials')
  })

  it('should not preload afterInteractive scripts at default priority', async () => {
    const $ = await next.render$('/after-interactive')

    const fetchPriorities = $(
      'link[rel="preload"][href="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"]'
    )
      .toArray()
      .map((el) => $(el).attr('fetchpriority') ?? 'auto')

    // An `afterInteractive` third-party script must not be preloaded at the
    // default priority, otherwise it competes with the resources needed for
    // the initial render.
    expect(fetchPriorities).not.toContain('auto')
  })
})
