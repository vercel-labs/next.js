import { FileRef, nextTestSetup } from 'e2e-utils'
import { join } from 'path'
import stripAnsi from 'strip-ansi'

const mockedGoogleFontResponses = require.resolve(
  './google-font-file-fetch-error/mocked-responses.js'
)

const FONT_FILE_URL =
  'http://127.0.0.1:1/roboto-this-font-file-cannot-be-downloaded.woff2'

// Regression test for https://github.com/vercel/next.js/issues/97378: when the
// Google Fonts stylesheet is fetched successfully but downloading one of the
// font files it references fails, the build failed with an internal
// `Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'`
// error instead of reporting the failed font file download.
describe('next/font/google font file fetch error', () => {
  if ((global as any).isNextDeploy || (global as any).isNextDev) {
    it('should skip for dev and deploy', () => {})
    return
  }

  if (!process.env.IS_TURBOPACK_TEST) {
    // The webpack loader mocks font file downloads as well when
    // NEXT_FONT_GOOGLE_MOCKED_RESPONSES is set, so the download can't fail.
    it('should skip for webpack', () => {})
    return
  }

  const { next } = nextTestSetup({
    files: {
      pages: new FileRef(join(__dirname, 'google-font-file-fetch-error/pages')),
    },
    env: {
      NEXT_FONT_GOOGLE_MOCKED_RESPONSES: mockedGoogleFontResponses,
    },
    skipStart: true,
  })

  it('should fail the build with the failed font file download', async () => {
    await expect(next.start()).rejects.toThrow('next build failed')

    const cliOutput = stripAnsi(next.cliOutput)
    const buildError = cliOutput.slice(
      cliOutput.indexOf('Build error occurred')
    )

    // The build error must name the font file that could not be downloaded ...
    expect(buildError).toInclude(FONT_FILE_URL)
    // ... instead of an unresolvable internal module.
    expect(buildError).not.toInclude(
      "Can't resolve '@vercel/turbopack-next/internal/font/google/font'"
    )
  })
})
