import { nextTestSetup } from 'e2e-utils'
import { getDevCliValidationOutput } from 'e2e-utils/instant-validation'

// Regression test for https://github.com/vercel/next.js/issues/96671
//
// With `cacheComponents` enabled, a `next/dynamic` loader that uses a computed
// (template literal) import path, resolving to a Server Component which renders
// a Client Component descendant, logged
// "... (client reference proxy) ... but the module factory is not available"
// during the dev-time `instant` validation render, which in turn made the
// validation fail.
describe('cacheComponents - next/dynamic with a computed import path', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    // Emit `<VALIDATION_MESSAGE>` markers so we can wait for the dev-time
    // validation render (where the error surfaces) to finish.
    env: { NEXT_TEST_LOG_VALIDATION: '1' },
  })

  it('renders the client descendant without a missing module factory error', async () => {
    const res = await next.fetch('/demo')
    expect(res.status).toBe(200)

    const html = await res.text()
    expect(html).toContain('Dynamic tenant content')
    expect(html).toContain('Demo navigation')

    const validationOutput = await getDevCliValidationOutput(
      `${next.url}/demo`,
      () => next.cliOutput
    )

    expect(validationOutput).not.toContain(
      'the module factory is not available'
    )
    expect(validationOutput).toBe('')
  })
})
