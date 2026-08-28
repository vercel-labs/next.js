import { promises as fs } from 'fs'
import { join } from 'path'
import { nextTestSetup } from 'e2e-utils'

describe('cache-components-unlisted-params', () => {
  const { next, isNextStart, skipped } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (skipped) return

  it('should render 404 for params that are not returned by generateStaticParams', async () => {
    const res = await next.fetch('/post/hello')
    expect(res.status).toBe(200)

    const notFoundRes = await next.fetch('/post/not-listed')
    expect(notFoundRes.status).toBe(404)
  })

  if (isNextStart) {
    it('should not write an ISR cache entry for each unlisted param that 404s', async () => {
      const postDir = join(next.testDir, '.next/server/app/post')
      const before = (await fs.readdir(postDir)).sort()

      for (let i = 0; i < 5; i++) {
        const slug = `unlisted-${i}`

        // Request twice, so that a stale cache entry written by the first
        // request would also be served (and observable) on the second one.
        for (let attempt = 0; attempt < 2; attempt++) {
          const res = await next.fetch(`/post/${slug}`)
          expect(res.status).toBe(404)
        }
      }

      const after = (await fs.readdir(postDir)).sort()

      // Unlisted params are unbounded, so their 404 responses must not be
      // persisted in the ISR store under their own path.
      expect(after).toEqual(before)
    })
  }
})
