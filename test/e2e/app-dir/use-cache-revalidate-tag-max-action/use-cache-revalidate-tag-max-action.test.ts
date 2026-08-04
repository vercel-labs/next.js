import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('use-cache-revalidate-tag-max-action', () => {
  const { next, skipped, isNextDev } = nextTestSetup({
    files: __dirname,
    // The CLI output of a deployment is not available for assertions.
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  if (isNextDev) {
    // The stale-while-revalidate path for `"use cache"` entries only exists in
    // production, so there's nothing to assert in dev.
    it('is skipped in dev', () => {})

    return
  }

  it('does not fail server action requests that hit a stale "use cache" entry', async () => {
    const actionResponseStatuses: number[] = []

    const browser = await next.browser('/', {
      beforePageLoad(page) {
        page.on('response', async (response) => {
          const request = response.request()

          if (request.method() === 'POST') {
            actionResponseStatuses.push(response.status())
          }
        })
      },
    })

    const cliOutputLength = next.cliOutput.length

    // The first submit populates the cache entry, subsequent submits hit the
    // now-stale entry that `revalidateTag(tag, 'max')` has left behind.
    for (let i = 0; i < 3; i++) {
      await browser.elementById('add').click()

      await retry(async () => {
        expect(actionResponseStatuses).toHaveLength(i + 1)
      })
    }

    const cliOutput = next.cliOutput.slice(cliOutputLength)

    expect(cliOutput).not.toInclude('Unexpected end of form')
    expect(actionResponseStatuses).toEqual([200, 200, 200])
  })
})
