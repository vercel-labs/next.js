import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('hmr - deleted page replaced by an optional catch-all', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should serve the new optional catch-all after deleting the routes it replaces', async () => {
    expect((await next.fetch('/en/project')).status).toBe(200)
    expect((await next.fetch('/en/project/acme/home')).status).toBe(200)

    await next.deleteFile('app/[locale]/project/page.tsx')
    await next.deleteFile('app/[locale]/project/[projectId]/home/page.tsx')
    await next.patchFile(
      'app/[locale]/project/[[...slug]]/page.tsx',
      `export default function ProjectCatchAllPage() {
        return <main id="catch-all">new localized project catch-all</main>
      }`
    )

    await retry(async () => {
      for (const pathname of [
        '/en/project',
        '/en/project/acme/home',
        '/en/project/acme/schedule',
      ]) {
        const res = await next.fetch(pathname)
        expect({ pathname, status: res.status }).toEqual({
          pathname,
          status: 200,
        })
        expect(await res.text()).toContain('new localized project catch-all')
      }
    })

    expect(next.cliOutput).not.toContain(
      'You cannot define a route with the same specificity as a optional catch-all route'
    )
  })
})
