import { nextTestSetup } from 'e2e-utils'

const MARKER = 'inline_before_interactive_marker'

describe('inline beforeInteractive Script body duplication', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should ship the inline body once, in the executable __next_s push only', async () => {
    const html = await next.render('/')

    // The executable copy consumed by `loadScriptsInSequence` must be present.
    expect(html).toContain('self.__next_s=self.__next_s||[]')
    const executablePush = html.match(
      /\(self\.__next_s=self\.__next_s\|\|\[\]\)\.push\(\[0,[^<]*\)/
    )?.[0]
    expect(executablePush).toContain(MARKER)

    // The same body must not be shipped a second time inside the RSC flight
    // payload, where nothing reads it in production.
    const flightRows = html.match(/self\.__next_f\.push\(\[1,[^<]*\)/g) ?? []
    expect(flightRows.length).toBeGreaterThan(0)
    expect(flightRows.filter((row) => row.includes(MARKER))).toEqual([])

    expect(html.split(MARKER).length - 1).toBe(1)
  })

  it('should still execute the inline beforeInteractive script', async () => {
    const browser = await next.browser('/')
    expect(
      await browser.eval(() => (window as any).__inlineBeforeInteractiveMarker__)
    ).toBe(MARKER)
  })
})
