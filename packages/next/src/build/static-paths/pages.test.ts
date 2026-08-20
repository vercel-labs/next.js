import { buildPagesStaticPaths } from './pages'

async function buildPaths(page: string, paths: any[]) {
  return buildPagesStaticPaths({
    page,
    configFileName: 'next.config.js',
    getStaticPaths: async () => ({ paths, fallback: false }),
  })
}

describe('buildPagesStaticPaths', () => {
  it('accepts string params for a dynamic route', async () => {
    const { prerenderedRoutes } = await buildPaths('/articles/[page]', [
      { params: { page: '1' } },
    ])

    expect(prerenderedRoutes.map((route) => route.pathname)).toEqual([
      '/articles/1',
    ])
  })

  it('accepts an array of string params for a catch-all route', async () => {
    const { prerenderedRoutes } = await buildPaths('/tags/[...slug]', [
      { params: { slug: ['1', '2'] } },
    ])

    expect(prerenderedRoutes.map((route) => route.pathname)).toEqual([
      '/tags/1/2',
    ])
  })

  it('errors clearly when a required param is not a string', async () => {
    await expect(
      buildPaths('/articles/[page]', [{ params: { page: 1 } }])
    ).rejects.toThrow(
      'A required parameter (page) was not provided as a string received number in getStaticPaths for /articles/[page]'
    )
  })

  it('errors clearly when a catch-all param is not an array', async () => {
    await expect(
      buildPaths('/tags/[...slug]', [{ params: { slug: 'a/b' } }])
    ).rejects.toThrow(
      'A required parameter (slug) was not provided as an array received string in getStaticPaths for /tags/[...slug]'
    )
  })

  // https://github.com/vercel/next.js/issues/41281
  it('errors clearly when a catch-all param array contains non-string values', async () => {
    let error: unknown

    try {
      await buildPaths('/tags/[...slug]', [{ params: { slug: [1, 2] } }])
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(Error)
    const message = (error as Error).message

    // The failure must not be an unhandled internal error such as
    // "segment.replace is not a function" thrown from escapePathDelimiters.
    expect(message).not.toMatch(/is not a function/)
    expect(error).not.toBeInstanceOf(TypeError)

    // It must be actionable, naming the offending param and the page.
    expect(message).toContain('slug')
    expect(message).toContain('getStaticPaths')
    expect(message).toContain('/tags/[...slug]')
  })
})
