import { nextTestSetup } from 'e2e-utils'

// Regression test for https://github.com/vercel/next.js/issues/16660
// `pages/symlinktest` is a symlink to the `pages/nolink` directory, which
// contains both a static (`index.js`) and a dynamic (`[id].js`) route. Routes
// reached through the symlinked directory must be served in development, just
// like they already are by `next build` + `next start`.
describe('dynamic route in symlinked pages directory', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipStart: true,
  })

  beforeAll(async () => {
    // Created here rather than checked in, so the fixture does not depend on
    // symlink support in the checkout.
    await next.symlink('pages/nolink', 'pages/symlinktest')
    await next.start()
  })

  it('serves the dynamic route through the real directory', async () => {
    const res = await next.fetch('/nolink/123')
    expect(res.status).toBe(200)
    expect(await res.text()).toContain('Works dynamic')
  })

  it('serves the static route through the symlinked directory', async () => {
    const res = await next.fetch('/symlinktest')
    expect(res.status).toBe(200)
    expect(await res.text()).toContain('Works index')
  })

  it('serves the dynamic route through the symlinked directory', async () => {
    const res = await next.fetch('/symlinktest/123')
    expect(res.status).toBe(200)
    expect(await res.text()).toContain('Works dynamic')
  })
})
