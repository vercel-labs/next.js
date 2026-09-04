import { nextTestSetup, isNextDeploy } from 'e2e-utils'

// Regression test for https://github.com/vercel/next.js/issues/38863
// An automatically statically optimized pages-router page (no data fetching)
// rejected non-GET/HEAD requests with 405 in production, but rendered them
// with 200 in development.
describe('pages static page non-GET requests', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should render the static page for GET', async () => {
    const res = await next.fetch('/')
    expect(res.status).toBe(200)
    expect(await res.text()).toContain('hello world')
  })

  it.each(['POST', 'PUT', 'DELETE', 'PATCH'])(
    'should respond with 405 for %s to a static page',
    async (method) => {
      const res = await next.fetch('/', { method })

      expect(res.status).toBe(405)

      if (!isNextDeploy) {
        expect(res.headers.get('allow')).toBe('GET, HEAD')
        expect(await res.text()).toContain('Method Not Allowed')
      }
    }
  )
})
