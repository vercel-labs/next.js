import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('hmr-deleted-route-optional-catch-all', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should serve a newly added optional catch-all after the previous routes were deleted', async () => {
    // Compile the initial routes so their entries exist in the dev server.
    expect((await next.fetch('/project')).status).toBe(200)
    expect((await next.fetch('/project/acme/home')).status).toBe(200)

    // Replace both routes with an optional catch-all while the dev server runs.
    await next.deleteFile('app/[locale]/project/page.js')
    await next.deleteFile('app/[locale]/project/[projectId]/home/page.js')
    await next.patchFile(
      'app/[locale]/project/[[...slug]]/page.js',
      `export default function ProjectCatchAllPage() {
  return <main id="catch-all">new localized project catch-all</main>
}
`
    )

    for (const pathname of [
      '/project',
      '/project/acme/home',
      '/project/acme/schedule',
      '/en/project/acme/schedule',
    ]) {
      await retry(async () => {
        const res = await next.fetch(pathname)
        expect(res.status).toBe(200)
        expect(await res.text()).toContain('new localized project catch-all')
      }, 30_000)
    }
  })
})
