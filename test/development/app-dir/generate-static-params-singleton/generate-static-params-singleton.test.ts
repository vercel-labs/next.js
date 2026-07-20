import { nextTestSetup } from 'e2e-utils'

describe('generate-static-params singleton', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should initialize a route singleton once', async () => {
    const outputIndex = next.cliOutput.length
    const response = await next.fetch('/first')

    expect(response.status).toBe(200)
    expect(await response.text()).toContain('first')
    expect(next.cliOutput.slice(outputIndex)).toIncludeRepeated(
      'route singleton created',
      1
    )
  })
})
