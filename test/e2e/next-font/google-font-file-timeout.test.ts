import { createServer, type Server } from 'http'
import { mkdtempSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { FileRef, nextTestSetup } from 'e2e-utils'
import { findPort } from 'next-test-utils'

// Regression test for https://github.com/vercel/next.js/issues/97344
//
// Turbopack bounds the Google Fonts fetch (dev: 10s per attempt, 1 retry). When
// downloading a `@font-face` file takes longer than that budget, the font file
// import used to resolve to `ResolveResult::unresolvable()`, which surfaced as
// `Module not found: Can't resolve
// '@vercel/turbopack-next/internal/font/google/font'` and made the route 500 in
// dev. Fonts with many unicode-range slices (CJK families) hit this first.
//
// The stylesheet is mocked, but the `@font-face` urls in it point at a local
// server that responds slower than the dev fetch budget, so only the font file
// download is slow. Note that with `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` set, the
// webpack loader never downloads font files at all (see
// `packages/font/src/google/fetch-font-file.ts`), matching the report that
// `next dev --webpack` is unaffected.

// Longer than the 10s per-attempt dev fetch timeout in
// `crates/next-core/src/next_config.rs`.
const FONT_FILE_RESPONSE_DELAY = 12_000

const MODULE_NOT_FOUND_ERROR =
  "Can't resolve '@vercel/turbopack-next/internal/font/google/font'"

// The mocked responses path has to be known before `next dev` starts, but the
// port of the font file server is only known later, so write the file into a
// unique temporary directory from the test body.
const mockedResponsesPath = join(
  mkdtempSync(join(tmpdir(), 'next-font-slow-font-file-')),
  'mocked-responses.js'
)

function writeMockedResponses(fontFileOrigin: string) {
  const css = `/* latin */
@font-face {
  font-family: 'Noto Sans JP';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(${fontFileOrigin}/slow-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}
/* japanese */
@font-face {
  font-family: 'Noto Sans JP';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(${fontFileOrigin}/slow-japanese.woff2) format('woff2');
  unicode-range: U+3041-3096, U+30A1-30FA;
}
`

  writeFileSync(
    mockedResponsesPath,
    `module.exports = ${JSON.stringify({
      'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400&display=swap':
        css,
    })}\n`
  )
}

describe('next/font/google slow font file download', () => {
  // Only Turbopack downloads the font files when the responses are mocked, and
  // only `next dev` uses the short 10s fetch timeout.
  if (
    !process.env.IS_TURBOPACK_TEST ||
    !(global as any).isNextDev ||
    (global as any).isNextDeploy
  ) {
    it('should skip when not next dev with Turbopack', () => {})
    return
  }

  const { next } = nextTestSetup({
    files: {
      pages: new FileRef(join(__dirname, 'google-font-file-timeout/pages')),
    },
    env: {
      NEXT_FONT_GOOGLE_MOCKED_RESPONSES: mockedResponsesPath,
    },
    skipStart: true,
  })

  let server: Server
  let requestedFontFiles: string[] = []

  beforeAll(async () => {
    const port = await findPort()
    server = createServer((req, res) => {
      requestedFontFiles.push(req.url!)
      setTimeout(() => {
        res.writeHead(200, {
          'Content-Type': 'font/woff2',
          'Cache-Control': 'no-store',
        })
        // Not a parseable font, the test only asserts on compilation.
        res.end(Buffer.from('wOF2 slow font file'))
      }, FONT_FILE_RESPONSE_DELAY)
    })
    await new Promise<void>((resolve) => server.listen(port, resolve))

    writeMockedResponses(`http://localhost:${port}`)
    await next.start()
  })

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve))
    }
  })

  it('should not fail to resolve the font file when the download is slow', async () => {
    const res = await next.fetch('/')

    expect(requestedFontFiles.length).toBeGreaterThan(0)
    expect(next.cliOutput).not.toContain(MODULE_NOT_FOUND_ERROR)
    expect(await res.text()).toContain('Hello world')
    expect(res.status).toBe(200)
  }, 180_000)
})
