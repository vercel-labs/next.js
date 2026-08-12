import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

// Regression test for https://github.com/vercel/next.js/issues/97206
// A JSON file that is only reached through a dynamic `import()` inside a module
// that is shared by the root layout and the page was not invalidated by
// Turbopack in `next dev`: the server kept rendering the stale content until it
// was restarted, while webpack picked the edit up.
describe('hmr - dynamic import shared between layout and page', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('reflects edits to a dynamically imported JSON file', async () => {
    expect(await next.render('/')).toContain('original subtitle')

    await next.patchFile(
      'messages/en.json',
      JSON.stringify({ Home: { subtitle: 'updated subtitle' } }),
      async () => {
        await retry(async () => {
          expect(await next.render('/')).toContain('updated subtitle')
        }, 15000)
      }
    )

    await retry(async () => {
      expect(await next.render('/')).toContain('original subtitle')
    }, 15000)
  })
})
