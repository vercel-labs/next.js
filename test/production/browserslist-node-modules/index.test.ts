import { nextTestSetup } from 'e2e-utils'
import { execSync } from 'child_process'

// Regression test for https://github.com/vercel/next.js/issues/45473
// A dependency inside `node_modules` that ships syntax newer than the
// project's browserslist target has to be downleveled as well, otherwise
// browsers that are still supported (here: Safari 12, which does not
// implement optional chaining) fail to execute the client bundle.
describe('browserslist node_modules', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    dependencies: {
      'es-check': '9.6.4',
      // Ships `descriptor?.enumerable` (ES2020) as published output.
      'filter-obj': '5.1.0',
    },
    packageJson: {
      browserslist: ['safari 12'],
    },
  })

  it('should include the dependency in the client bundle', async () => {
    const html = await next.render('/')
    expect(html).toContain('<p id="result">a</p>')
  })

  it('should downlevel JS shipped by a dependency', () => {
    let esCheckOutput: string
    try {
      esCheckOutput = execSync(
        'node_modules/.bin/es-check es2019 ".next/static/**/*.js" --noCache',
        { cwd: next.testDir, encoding: 'utf8', stdio: 'pipe' }
      )
    } catch (err) {
      esCheckOutput = `${err.stdout ?? ''}${err.stderr ?? ''}`
    }

    expect(esCheckOutput).toContain('info: ✓ ES-Check passed!')
  })
})
