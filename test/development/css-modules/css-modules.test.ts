import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'
import { join } from 'path'

describe('Has CSS Module in computed styles in Development', () => {
  const { next } = nextTestSetup({
    files: join(__dirname, 'fixtures/dev-module'),
  })

  it('should have CSS for page', async () => {
    const browser = await next.browser('/')

    const currentColor = await browser.eval(
      `window.getComputedStyle(document.querySelector('#verify-red')).color`
    )
    expect(currentColor).toMatchInlineSnapshot(`"rgb(255, 0, 0)"`)
  })
})

describe('Can hot reload CSS Module without losing state', () => {
  const { next } = nextTestSetup({
    files: join(__dirname, 'fixtures/hmr-module'),
  })

  it('should update CSS color without remounting <input>', async () => {
    const browser = await next.browser('/')

    const desiredText = 'hello world'
    await browser.elementById('text-input').type(desiredText)
    expect(await browser.elementById('text-input').getValue()).toBe(desiredText)

    const currentColor = await browser.eval(
      `window.getComputedStyle(document.querySelector('#verify-red')).color`
    )
    expect(currentColor).toMatchInlineSnapshot(`"rgb(255, 0, 0)"`)

    const cssFilePath = 'pages/index.module.css'
    const originalContent = await next.readFile(cssFilePath)
    try {
      await next.patchFile(
        cssFilePath,
        originalContent.replace('color: red', 'color: purple')
      )

      await retry(async () => {
        const refreshedColor = await browser.eval(
          `window.getComputedStyle(document.querySelector('#verify-red')).color`
        )
        expect(refreshedColor).toMatchInlineSnapshot(`"rgb(128, 0, 128)"`)
      })

      expect(await browser.elementById('text-input').getValue()).toBe(
        desiredText
      )
    } finally {
      await next.patchFile(cssFilePath, originalContent)
    }
  })
})

describe('Can hot reload a CSS Module from an unmounted lazy route', () => {
  const { next, isTurbopack } = nextTestSetup({
    files: join(__dirname, 'fixtures/hmr-unmounted-lazy-route'),
  })
  const itTurbopack = isTurbopack ? it : it.skip

  beforeAll(async () => {
    if (!isTurbopack) return

    // This overlapping graph preserves the chunking trigger from #74749 while
    // avoiding hundreds of checked-in, mechanically generated fixture files.
    await Promise.all(
      Array.from({ length: 40 }, (_, id) =>
        next.patchFile(
          `styles/${id}.module.css`,
          `.box { color: rgb(${id}, 0, 0); }\n`
        )
      )
    )
    await Promise.all(
      Array.from({ length: 3 }, (_, route) => {
        const firstStyle = route * 5
        const styleIds = Array.from(
          { length: 30 },
          (_, offset) => firstStyle + offset
        )
        const imports = styleIds
          .map((id) => `import s${id} from '../styles/${id}.module.css'`)
          .join('\n')
        const elements = styleIds
          .map(
            (id) =>
              `<div id="component-${id}" className={s${id}.box}>C${id}</div>`
          )
          .join('\n')

        return next.patchFile(
          `routes/route-${route}.js`,
          `${imports}\n\nexport default function Route() {\n  return <section id="route-${route}">${elements}</section>\n}\n`
        )
      })
    )
  })

  itTurbopack(
    'does not throw when editing CSS after its lazy route unmounts',
    async () => {
      const pageErrors: Error[] = []
      const browser = await next.browser('/', {
        beforePageLoad(page) {
          page.on('pageerror', (error) => pageErrors.push(error))
        },
      })

      await browser.elementById('route-2-button').click()
      await browser.waitForElementByCss('#component-30')
      await browser.elementById('route-0-button').click()
      await browser.waitForElementByCss('#component-0')
      expect(await browser.hasElementByCssSelector('#component-30')).toBe(false)

      await browser.eval(`
        window.__NO_RELOAD = true
        window.__HMR_STATE = 'pending'
        window.__NEXT_HMR_CB = () => { window.__HMR_STATE = 'success' }
      `)

      const cssFilePath = 'styles/30.module.css'
      const originalContent = await next.readFile(cssFilePath)
      try {
        await next.patchFile(
          cssFilePath,
          originalContent.replace('rgb(30, 0, 0)', 'rgb(1, 2, 3)')
        )

        await retry(async () => {
          const hmrComplete =
            (await browser.eval('window.__HMR_STATE')) === 'success'
          expect(hmrComplete || pageErrors.length > 0).toBe(true)
        })

        expect(pageErrors.map((error) => error.message)).toEqual([])
        expect(await browser.eval('window.__NO_RELOAD')).toBe(true)

        await browser.elementById('route-2-button').click()
        await browser.waitForElementByCss('#component-30')
        expect(
          await browser.elementById('component-30').getComputedCss('color')
        ).toBe('rgb(1, 2, 3)')
      } finally {
        await next.patchFile(cssFilePath, originalContent)
      }
    }
  )
})
