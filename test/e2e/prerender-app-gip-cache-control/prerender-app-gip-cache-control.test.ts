import { nextTestSetup } from 'e2e-utils'

describe('prerender with getInitialProps in _app', () => {
  const { next, isNextDev, skipped } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (skipped) return

  // in development there is no ISR cache-control to override
  if (isNextDev) {
    it('should render the page', async () => {
      const res = await next.fetch('/blocking/lazy')
      expect(res.status).toBe(200)
    })
    return
  }

  it('should use ISR cache-control for a prerendered page and not the one from _app', async () => {
    const res = await next.fetch('/blocking/prerendered')
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe(
      's-maxage=2, stale-while-revalidate=31535998'
    )
  })

  it('should use ISR cache-control on a cache miss and not the one from _app', async () => {
    const res = await next.fetch(`/blocking/lazy-${Date.now()}`)
    expect(res.status).toBe(200)
    expect(res.headers.get('x-nextjs-cache')).toBe('MISS')
    expect(res.headers.get('cache-control')).toBe(
      's-maxage=2, stale-while-revalidate=31535998'
    )
  })
})
