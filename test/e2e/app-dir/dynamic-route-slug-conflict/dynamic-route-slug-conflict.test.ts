import { isNextStart, nextTestSetup } from 'e2e-utils'
;(isNextStart ? describe : describe.skip)('dynamic route slug conflict', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipStart: true,
    skipDeployment: true,
  })

  it('fails the build when sibling dynamic segments use different slug names', async () => {
    const { exitCode, cliOutput } = await next.build()

    expect(exitCode).toBe(1)
    expect(cliOutput).toContain(
      'You cannot use different slug names for the same dynamic path'
    )
    expect(cliOutput).toContain("'item_id' !== 'parent_item_id'")
  })
})
