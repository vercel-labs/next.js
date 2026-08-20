import * as Log from 'next/dist/build/output/log'
import nextFontGoogleFontLoader from './loader'
import { fetchResource } from './fetch-resource'

jest.mock('./fetch-resource')
jest.mock('next/dist/build/output/log', () => ({
  warn: jest.fn(),
  error: jest.fn(),
}))

const mockFetchResource = fetchResource as jest.Mock

describe('next/font/google loader', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('URL from options', () => {
    const fixtures: Array<[string, any, string]> = [
      [
        'Inter',
        {},
        'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
      ],
      [
        'Inter',
        { weight: '400' },
        'https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap',
      ],
      [
        'Inter',
        { weight: '900', display: 'block' },
        'https://fonts.googleapis.com/css2?family=Inter:wght@900&display=block',
      ],
      [
        'Source_Sans_3',
        { weight: '900', display: 'auto' },
        'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@900&display=auto',
      ],
      [
        'Source_Sans_3',
        { weight: '200', style: 'italic' },
        'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@1,200&display=swap',
      ],
      [
        'Roboto_Flex',
        { display: 'swap' },
        'https://fonts.googleapis.com/css2?family=Roboto+Flex:wght@100..1000&display=swap',
      ],
      [
        'Roboto_Flex',
        { display: 'fallback', weight: 'variable', axes: ['opsz'] },
        'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=fallback',
      ],
      [
        'Roboto_Flex',
        {
          display: 'optional',
          axes: ['YTUC', 'slnt', 'wdth', 'opsz', 'XTRA', 'YTAS'],
        },
        'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,slnt,wdth,wght,XTRA,YTAS,YTUC@8..144,-10..0,25..151,100..1000,323..603,649..854,528..760&display=optional',
      ],
      [
        'Oooh_Baby',
        { weight: '400' },
        'https://fonts.googleapis.com/css2?family=Oooh+Baby:wght@400&display=swap',
      ],
      [
        'Albert_Sans',
        { weight: 'variable', style: 'italic' },
        'https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@1,100..900&display=swap',
      ],
      [
        'Fraunces',
        { weight: 'variable', style: 'italic', axes: ['WONK', 'opsz', 'SOFT'] },
        'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@1,9..144,100..900,0..100,0..1&display=swap',
      ],
      [
        'Molle',
        { weight: '400' },
        'https://fonts.googleapis.com/css2?family=Molle:ital,wght@1,400&display=swap',
      ],
      [
        'Roboto',
        { weight: ['500', '300', '400'], style: ['normal', 'italic'] },
        'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap',
      ],
      [
        'Roboto Mono',
        { style: ['italic', 'normal'] },
        'https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap',
      ],
      [
        'Fraunces',
        {
          style: ['normal', 'italic'],
          axes: ['WONK', 'opsz', 'SOFT'],
        },
        'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&display=swap',
      ],
      [
        'Poppins',
        { weight: ['900', '400', '100'] },
        'https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;900&display=swap',
      ],
      [
        'Nabla',
        {},
        'https://fonts.googleapis.com/css2?family=Nabla&display=swap',
      ],
      [
        'Nabla',
        { axes: ['EDPT', 'EHLT'] },
        'https://fonts.googleapis.com/css2?family=Nabla:EDPT,EHLT@0..200,0..24&display=swap',
      ],
      [
        'Ballet',
        {},
        'https://fonts.googleapis.com/css2?family=Ballet&display=swap',
      ],
    ]
    test.each(fixtures)(
      '%s',
      async (
        functionName: string,
        fontFunctionArguments: any,
        expectedUrl: any
      ) => {
        mockFetchResource.mockResolvedValue(Buffer.from('OK'))
        const { css } = await nextFontGoogleFontLoader({
          functionName,
          data: [
            {
              adjustFontFallback: false,
              subsets: [],
              ...fontFunctionArguments,
            },
          ],
          emitFontFile: jest.fn(),
          resolve: jest.fn(),
          loaderContext: {} as any,
          isDev: false,
          isServer: true,
          variableName: 'myFont',
        })
        expect(css).toBe('OK')
        expect(mockFetchResource).toHaveBeenCalledTimes(1)
        expect(mockFetchResource).toHaveBeenCalledWith(
          expectedUrl,
          false,
          expect.stringContaining('Failed to fetch font')
        )
      }
    )
  })

  // https://github.com/vercel/next.js/issues/44375
  describe('weight on a variable font', () => {
    // Shape of the CSS Google Fonts returns for `Inter:wght@600`: the
    // @font-face is pinned to the requested weight instead of declaring the
    // variable `font-weight: 100 900` range.
    const pinnedCss = `/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v13/pinned.woff2) format('woff2');
  unicode-range: U+0000-00FF;
}`

    async function loadFont(functionName: string, fontFunctionArguments: any) {
      mockFetchResource.mockImplementation(async (url: string) =>
        Buffer.from(
          url.startsWith('https://fonts.googleapis.com')
            ? pinnedCss
            : 'font-data'
        )
      )

      return nextFontGoogleFontLoader({
        functionName,
        data: [
          {
            adjustFontFallback: false,
            subsets: [],
            ...fontFunctionArguments,
          },
        ],
        emitFontFile: () => '/_next/static/media/pinned.woff2',
        resolve: jest.fn(),
        loaderContext: {} as any,
        isDev: false,
        isServer: true,
        variableName: 'myFont',
      })
    }

    it('warns that `font-weight` stops working when a weight is set on a variable font', async () => {
      const { css } = await loadFont('Inter', { weight: '600' })

      // The single @font-face is pinned to the requested weight, so every
      // `font-weight` between 100 and 900 renders identically at runtime.
      expect(css).toContain('font-weight: 600')
      expect(css).not.toContain('font-weight: 100 900')

      // `Inter` has a variable `wght` axis, so the pinning is silent today and
      // there is nothing pointing users at the cause.
      expect(Log.warn).toHaveBeenCalledWith(
        expect.stringMatching(/Inter[\s\S]*weight/)
      )
    })

    it('does not warn when the font has no variable weight axis', async () => {
      await loadFont('Poppins', { weight: '500' })

      expect(Log.warn).not.toHaveBeenCalled()
    })
  })
})
