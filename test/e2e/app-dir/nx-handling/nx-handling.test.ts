/* eslint-disable jest/no-standalone-expect */
import { nextTestSetup, isNextDev } from 'e2e-utils'

describe('nx-handling', () => {
  const { next, isTurbopack } = nextTestSetup({
    skipDeployment: true,
    files: __dirname,
    installCommand: 'npm i',
    buildCommand: 'npm run build',
    startCommand: isNextDev ? 'npm run dev' : 'npm run start',
    packageJson: {
      name: '@nx-next/source',
      version: '0.0.0',
      private: true,
      packageManager: 'npm@10.9.2',
      scripts: {
        build: 'rm -rf dist; nx run next-nx-test:build',
        dev: 'nx run next-nx-test:dev',
        start: 'nx run next-nx-test:serve:production',
      },
      dependencies: {
        react: '19.0.0',
        'react-dom': '19.0.0',
        '@nx/js': '22.4.2',
        '@nx/next': '22.4.2',
        '@nx/workspace': '22.4.2',
        '@swc-node/register': '~1.9.1',
        '@swc/cli': '~0.6.0',
        '@swc/core': '~1.5.7',
        '@swc/helpers': '~0.5.11',
        '@types/react': '19.0.0',
        '@types/react-dom': '19.0.0',
        nx: '22.4.2',
        tslib: '^2.3.0',
        typescript: '~5.7.2',
      },
      workspaces: ['apps/*'],
    },
  })

  it('should work for pages page', async () => {
    const res = await next.fetch('/pages-test')
    expect(res.status).toBe(200)
    expect(await res.text()).toContain('Hello world')
  })

  it('should work for pages API', async () => {
    const res = await next.fetch('/api/pages-api')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello, from pages API!')
  })

  it('should work with app page', async () => {
    const res = await next.fetch('/')
    expect(res.status).toBe(200)
    expect(await res.text()).toContain('Welcome @nx-next/next-nx-test')
  })

  it('should work with app route', async () => {
    const res = await next.fetch('/api/hello')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello, from API!')
  })

  // TODO: Remove `it.failing` when https://github.com/vercel/next.js/issues/94980 is fixed.
  // The external Button stylesheet is currently appended again after navigating
  // to the catalog, overriding the equal-specificity route stylesheet on Back.
  ;(isNextDev && isTurbopack ? it.failing : it.skip)(
    'should preserve external CSS module order across client navigation',
    async () => {
      const browser = await next.browser('/css-order')
      const button = () => browser.elementByCss('#css-order-link')

      expect(await button().getComputedCss('background-color')).toBe(
        'rgba(0, 0, 0, 0)'
      )

      await button().click()
      await browser.waitForElementByCss('#catalog')
      await browser.back().waitForElementByCss('#css-order-link')

      expect(await button().getComputedCss('background-color')).toBe(
        'rgba(0, 0, 0, 0)'
      )
    }
  )
})
