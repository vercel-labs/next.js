import { nextTestSetup } from 'e2e-utils'

// https://github.com/vercel/next.js/issues/19046
// `next dev` should always run in development mode, even when `NODE_ENV` is
// set to `production` in the environment.
describe('next dev with NODE_ENV=production', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    env: { NODE_ENV: 'production' },
  })

  it('should render the page instead of erroring', async () => {
    const res = await next.fetch('/')
    expect(res.status).toBe(200)

    const $ = await next.render$('/')
    expect($('#hello').text()).toBe('hello world')
    expect(next.cliOutput).not.toContain('jsxDEV is not a function')
  })
})
