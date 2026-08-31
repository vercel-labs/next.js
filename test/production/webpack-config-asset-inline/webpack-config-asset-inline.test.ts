import { nextTestSetup } from 'e2e-utils'

// Skip webpack specific test in Turbopack
;(process.env.IS_TURBOPACK_TEST ? describe.skip : describe)(
  'webpack config with a custom asset/inline module rule',
  () => {
    const { next } = nextTestSetup({
      files: __dirname,
      skipStart: true,
    })

    // Next.js sets `module.generator.asset.filename`, which webpack applies to
    // every asset subtype, including `asset/inline` where `filename` is not a
    // valid generator option.
    // https://github.com/vercel/next.js/issues/34501
    it('should build a custom asset/inline rule without an invalid generator object', async () => {
      const { exitCode, cliOutput } = await next.build()
      expect(cliOutput).not.toContain('Invalid generator object')
      expect(exitCode).toBe(0)
    })
  }
)
