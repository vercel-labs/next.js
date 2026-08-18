import { nextTestSetup } from 'e2e-utils'

describe('not-found error shell lang', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should keep the layout lang attribute on the served notFound() shell', async () => {
    const res = await next.fetch('/rp1452probe')
    const html = await res.text()

    expect(res.status).toBe(404)
    expect(html).toContain('Not Found')
    // The error shell is emitted instead of the root layout, so the document
    // language of the route is lost (WCAG 3.1.1).
    expect(html).toMatch(/<html[^>]*\slang="de"/)
  })
})
