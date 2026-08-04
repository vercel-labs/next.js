import { nextTestSetup } from 'e2e-utils'

// Regression test for https://github.com/vercel/next.js/issues/96677
describe('use-cache-mdx', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    dependencies: {
      '@next/mdx': 'canary',
      '@mdx-js/loader': '^3.1.0',
      '@mdx-js/react': '^3.1.0',
    },
  })

  it('should render an MDX component that is returned from a "use cache" function', async () => {
    const $ = await next.render$('/blog')

    expect($('h1').text()).toBe('Hello MDX')
    expect($('p').text()).toBe(
      'This is MDX content rendered from a cached function.'
    )
    expect(next.cliOutput).not.toContain(
      'Functions cannot be passed directly to Client Components'
    )
  })
})
