import { nextTestSetup } from 'e2e-utils'

describe('generate-static-params singleton', () => {
  const { next, isNextDev, skipped } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  // Regression for https://github.com/vercel/next.js/issues/69042.
  // Reproduction: https://github.com/vaneenige/next-app-router-singleton/tree/d09b4b7e039d21b01ae817e2c909b02f5c00b282
  it('should share a route singleton between generateStaticParams and page evaluation', async () => {
    const outputIndex = next.cliOutput.length
    const response = await next.fetch('/first')

    expect(response.status).toBe(200)
    expect(await response.text()).toContain('first')

    // In dev, both phases run on demand after the request starts. In start
    // mode, they ran during the build, so inspect the complete build output.
    const output = isNextDev
      ? next.cliOutput.slice(outputIndex)
      : next.cliOutput

    expect(output).toContain('generateStaticParams executed')
    expect(output).toIncludeRepeated('route singleton created', 1)
  })
})
