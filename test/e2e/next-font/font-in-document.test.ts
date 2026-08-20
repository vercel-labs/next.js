import { nextTestSetup } from 'e2e-utils'
import { join } from 'path'

const mockedGoogleFontResponses = require.resolve(
  './google-font-mocked-responses.js'
)

describe('next/font/google in custom _document', () => {
  const { next } = nextTestSetup({
    files: join(__dirname, 'font-in-document'),
    env: {
      NEXT_FONT_GOOGLE_MOCKED_RESPONSES: mockedGoogleFontResponses,
    },
  })

  it('applies the font of a font loader used in _document to <html>', async () => {
    const $ = await next.render$('/')
    expect($('#page').text()).toBe('hello world')

    const browser = await next.browser('/')
    // The classes applied to `<Html>` in `_document` should have a definition,
    // so the css variable and the font-family resolve on the root element.
    expect(
      await browser.eval(
        `getComputedStyle(document.documentElement).getPropertyValue('--font-inter')`
      )
    ).toMatch(/Inter/)
    expect(
      await browser.eval(
        `getComputedStyle(document.documentElement).fontFamily`
      )
    ).toMatch(/Inter/)
  })
})
