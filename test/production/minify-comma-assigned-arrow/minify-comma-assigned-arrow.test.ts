import { nextTestSetup } from 'e2e-utils'

describe('minify comma-assigned arrow helper', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  // Regression test for https://github.com/vercel/next.js/issues/97517: the
  // minifier inlined a comma-assigned arrow helper into a nested arrow and
  // emitted `a => b => { let b, c; ... }`, so the build failed while collecting
  // page data with "SyntaxError: Identifier 'b' has already been declared".
  it('should render a page importing a pre-minified module', async () => {
    const $ = await next.render$('/')
    expect($('#result').text()).toBe('ac')
  })
})
