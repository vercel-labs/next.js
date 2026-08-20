import { urlToUrlWithoutFlightMarker } from './route-params'

describe('urlToUrlWithoutFlightMarker', () => {
  // The segment-file rewriting only happens in production builds of an
  // `output: "export"` app.
  const originalNodeEnv = process.env.NODE_ENV
  const originalConfigOutput = process.env.__NEXT_CONFIG_OUTPUT

  beforeAll(() => {
    // @ts-expect-error -- NODE_ENV is read-only in the types
    process.env.NODE_ENV = 'production'
    process.env.__NEXT_CONFIG_OUTPUT = 'export'
  })

  afterAll(() => {
    // @ts-expect-error -- NODE_ENV is read-only in the types
    process.env.NODE_ENV = originalNodeEnv
    process.env.__NEXT_CONFIG_OUTPUT = originalConfigOutput
  })

  it('removes the RSC union query', () => {
    expect(
      urlToUrlWithoutFlightMarker(
        new URL('https://example.com/target.txt?_rsc=1a2b3c&foo=bar')
      ).toString()
    ).toBe('https://example.com/target?foo=bar')
  })

  it('keeps the trailing slash when removing the `/index.txt` marker', () => {
    // Regression test for a static export with `trailingSlash: true`, where a
    // build ID mismatch makes the router fall back to an MPA navigation to the
    // response URL. Dropping the trailing slash here sends the browser to
    // `/target` instead of the configured `/target/`.
    expect(
      urlToUrlWithoutFlightMarker(
        new URL('https://example.com/target/index.txt?_rsc=1a2b3c')
      ).toString()
    ).toBe('https://example.com/target/')
  })

  it('keeps the trailing slash for the root `/index.txt` marker', () => {
    expect(
      urlToUrlWithoutFlightMarker(
        new URL('https://example.com/index.txt?_rsc=1a2b3c')
      ).toString()
    ).toBe('https://example.com/')
  })

  it('keeps the trailing slash when a base path is used', () => {
    expect(
      urlToUrlWithoutFlightMarker(
        new URL('https://example.com/docs/target/index.txt?_rsc=1a2b3c')
      ).toString()
    ).toBe('https://example.com/docs/target/')
  })
})
