import { FileRef, nextTestSetup } from 'e2e-utils'
import { createServer, type Server } from 'http'
import type { AddressInfo } from 'net'
import { rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

// Regression test for https://github.com/vercel/next.js/issues/97376:
// an HTTP error on a font file must be retried and must be reported with its
// status and url, instead of turning into an unresolvable internal module.
//
// The mocked stylesheet has to be generated at runtime because it points at the
// port of the local server that stands in for fonts.gstatic.com.
const mockedResponsesPath = join(
  tmpdir(),
  `next-font-google-font-file-fetch-error-${process.pid}.js`
)
const stylesheetUrl =
  'https://fonts.googleapis.com/css2?family=Indie+Flower:wght@400&display=swap'

describe('next/font/google font file fetch error', () => {
  if (
    // The webpack loader does not request font files when responses are mocked.
    !process.env.IS_TURBOPACK_TEST ||
    // In development a fallback font is used instead of failing.
    (global as any).isNextDev ||
    (global as any).isNextDeploy
  ) {
    it('skipped', () => {})
    return
  }

  const { next } = nextTestSetup({
    files: {
      pages: new FileRef(join(__dirname, 'google-font-file-fetch-error/pages')),
    },
    env: {
      NEXT_FONT_GOOGLE_MOCKED_RESPONSES: mockedResponsesPath,
    },
    skipStart: true,
  })

  let server: Server
  let fontFileRequests = 0
  let fontFileUrl: string

  beforeAll(async () => {
    server = createServer((_req, res) => {
      fontFileRequests++
      res.statusCode = 404
      res.end('not found')
    })
    await new Promise<void>((resolve) =>
      server.listen(0, '127.0.0.1', () => resolve())
    )
    fontFileUrl = `http://127.0.0.1:${
      (server.address() as AddressInfo).port
    }/indie-flower-latin-400.woff2`

    writeFileSync(
      mockedResponsesPath,
      `module.exports = ${JSON.stringify({
        [stylesheetUrl]: `/* latin */
@font-face {
  font-family: 'Indie Flower';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(${fontFileUrl}) format('woff2');
  unicode-range: U+0000-00FF;
}
`,
      })}`
    )
  })

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()))
    rmSync(mockedResponsesPath, { force: true })
  })

  it('should retry the font file and report the failing request', async () => {
    await expect(next.start()).rejects.toThrow('next build failed')

    // A single transient failure should not fail the build.
    expect(fontFileRequests).toBeGreaterThan(1)

    // The build error should name the failing request, not an internal module.
    expect(next.cliOutput).toInclude(fontFileUrl)
    expect(next.cliOutput).toInclude('404')
    expect(next.cliOutput).not.toInclude(
      "Can't resolve '@vercel/turbopack-next/internal/font/google/font'"
    )
  })
})
