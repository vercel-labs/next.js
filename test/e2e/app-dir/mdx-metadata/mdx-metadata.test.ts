import { nextTestSetup } from 'e2e-utils'

describe('mdx metadata export', () => {
  const { next, isNextStart, skipped } = nextTestSetup({
    files: __dirname,
    dependencies: {
      '@next/mdx': 'canary',
      '@mdx-js/loader': '^3.1.1',
      '@mdx-js/react': '^3.1.1',
    },
    skipDeployment: true,
    skipStart: true,
  })

  if (skipped) return

  if (!isNextStart) {
    it('skipped in development mode', () => {})
    return
  }

  it('builds an MDX page that exports metadata', async () => {
    const { exitCode } = await next.build()
    expect(exitCode).toBe(0)

    const html = await next.readFile('.next/server/app/index.html')
    expect(html).toContain('<title>MDX metadata title</title>')
    expect(html).toContain('<h1>MDX metadata page</h1>')
  })
})
