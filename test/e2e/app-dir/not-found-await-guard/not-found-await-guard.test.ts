import { nextTestSetup } from 'e2e-utils'

// Regression test for https://github.com/vercel/next.js/issues/96944
// A `if (!value) notFound()` guard on a value produced by `await`ing an
// `async` function that returns `T | null` was optimized away in production
// builds, so the page rendered `null.name` (500) instead of a 404.
describe('app-dir - not-found-await-guard', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  const variants = [
    ['falsy test', ''],
    ['falsy test followed by a throw', 'throw'],
    ['falsy test inside a sync helper', 'parameter'],
    ['strict null check', 'strict-null'],
  ]

  for (const [name, variant] of variants) {
    it(`preserves the notFound() guard that uses a ${name}`, async () => {
      const res = await next.fetch(`/?v=${variant}`)

      expect(res.status).toBe(404)
      expect(await res.text()).not.toContain('unreachable')
    })
  }

  it('renders the page when the guarded value is not null', async () => {
    const res = await next.fetch('/?v=', {
      headers: { 'x-tenant-host': 'acme' },
    })

    expect(res.status).toBe(200)
    expect(await res.text()).toContain('Acme')
  })
})
