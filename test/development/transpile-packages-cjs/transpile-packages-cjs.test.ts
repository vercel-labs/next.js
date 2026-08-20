import { nextTestSetup } from 'e2e-utils'

// Regression test for https://github.com/vercel/next.js/issues/35110
// A linked (`file:`/yalc) package with `"type": "commonjs"` that is listed in
// `transpilePackages` is parsed as CommonJS, while the react-refresh loader
// appends `import.meta.webpackHot.accept()` to it, which failed to compile with
// `Module parse failed: Cannot use 'import.meta' outside a module`.
describe('transpile-packages with a commonjs package', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    dependencies: {
      'cjs-pkg': 'file:./pkg',
    },
    nextConfig: {
      transpilePackages: ['cjs-pkg'],
    },
  })

  it('should compile in development without an import.meta parse error', async () => {
    const $ = await next.render$('/')

    expect($('#from-pkg').text()).toBe('hello from cjs-pkg')
    expect(next.cliOutput).not.toContain(
      "Cannot use 'import.meta' outside a module"
    )
  })
})
