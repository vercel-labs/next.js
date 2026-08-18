import { nextTestSetup } from 'e2e-utils'

describe('app-dir - typed-routes-literal-union-params', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipStart: true,
  })

  // The generated `ParamMap` types every dynamic segment as `string`, so a
  // layout/page that narrows the segment to a string literal union is rejected
  // by the generated route validator even though `generateStaticParams` is
  // typed and `dynamicParams = false` makes the value set exhaustive.
  it('should type check params narrowed to a string literal union', async () => {
    const { exitCode, cliOutput } = await next.build()

    expect(cliOutput).not.toContain('Failed to type check')
    expect(cliOutput).not.toContain(
      "Type 'string' is not assignable to type 'Locale'"
    )
    expect(exitCode).toBe(0)
  })
})
