import { nextTestSetup } from 'e2e-utils'

function stripComments(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

// Turbopack fails the build loudly for the same stylesheet, so this only
// covers the bundlers that silently emit the `@import` in an invalid position.
;(process.env.IS_TURBOPACK_TEST ? describe.skip : describe)(
  'app dir - css @import after another rule',
  () => {
    const { next } = nextTestSetup({
      files: __dirname,
    })

    async function getStylesheetWithImport() {
      const $ = await next.render$('/')

      expect($('p.late-import').text()).toBe('hello world')

      const hrefs = $('link[rel="stylesheet"]')
        .map((_, el) => $(el).attr('href'))
        .get()
      const inlined = $('style')
        .map((_, el) => $(el).text())
        .get()
      const fetched = await Promise.all(
        hrefs.map(async (href) => (await next.fetch(href)).text())
      )

      const withImport = [...fetched, ...inlined]
        .map(stripComments)
        .filter((css) => css.includes('@import'))

      expect(withImport).toHaveLength(1)
      return withImport[0]
    }

    it('emits the @import before all other rules', async () => {
      const css = await getStylesheetWithImport()

      expect(css).toContain('imported.css')
      expect(css.indexOf('@import')).toBeLessThan(css.indexOf('.late-import'))
    })

    it('loads the imported stylesheet in the browser', async () => {
      const browser = await next.browser('/')

      expect(
        await browser.eval(
          `getComputedStyle(document.querySelector('.late-import')).letterSpacing`
        )
      ).toBe('7px')
      expect(
        await browser.eval(
          `[...document.styleSheets].flatMap((sheet) => [...sheet.cssRules]).filter((rule) => rule instanceof CSSImportRule).length`
        )
      ).toBeGreaterThan(0)
    })
  }
)
