import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('hmr-deleted-page-optional-catch-all', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('serves a newly added optional catch-all after deleting the pages it replaces', async () => {
    expect((await next.fetch('/project')).status).toBe(200)
    expect((await next.fetch('/project/acme/home')).status).toBe(200)

    // Replace the two existing routes with an optional catch-all while the dev
    // server keeps running.
    await next.deleteFile('app/[locale]/project/page.js')
    await next.deleteFile('app/[locale]/project/[projectId]/home/page.js')
    await next.patchFile(
      'app/[locale]/project/[[...slug]]/page.js',
      `export default function ProjectCatchAllPage() {
        return <main id="catch-all">new localized project catch-all</main>
      }`
    )

    for (const pathname of [
      '/project',
      '/project/acme/home',
      '/project/acme/schedule',
      '/en/project/acme/schedule',
    ]) {
      await retry(async () => {
        const res = await next.fetch(pathname)
        expect({ pathname, status: res.status }).toEqual({
          pathname,
          status: 200,
        })
        expect(await res.text()).toContain('new localized project catch-all')
      })
    }

    expect(next.cliOutput).not.toContain('same specificity as')
  })
})
