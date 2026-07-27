import { join } from 'path'
import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

const image =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='3' height='2'%3E%3Crect width='3' height='2' fill='red'/%3E%3C/svg%3E"

describe('with-vercel-blob example', () => {
  const { next, skipped } = nextTestSetup({
    files: join(__dirname, '../../../examples/with-vercel-blob'),
    dependencies: {
      '@headlessui/react': '1.7.4',
      '@heroicons/react': '2.0.13',
      '@types/node': '18.11.9',
      '@types/react': '18.2.8',
      '@types/react-dom': '18.2.4',
      'framer-motion': '7.6.4',
      react: '18.3.1',
      'react-dom': '18.3.1',
      'react-hooks-global-state': '2.0.0',
      'react-swipeable': '7.0.0',
      'react-use-keypress': '1.3.1',
      typescript: '5.9.3',
    },
    skipStart: true,
    skipDeployment: true,
  })

  if (skipped) return

  beforeAll(async () => {
    await next.patchFile(
      'utils/cachedImages.ts',
      `const images = [
  { id: 0, url: ${JSON.stringify(image)}, blurDataUrl: ${JSON.stringify(image)} },
  { id: 1, url: ${JSON.stringify(image)}, blurDataUrl: ${JSON.stringify(image)} },
]

export default async function getResults() {
  return images
}
`
    )
    await next.patchFile(
      'pages/_app.tsx',
      `import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
`
    )

    await next.start()
  })

  it('keeps the carousel open when navigating to another photo', async () => {
    const browser = await next.browser('/')

    await browser.elementByCss('a[href="/p/0"]').click()
    await retry(async () => {
      expect(new URL(await browser.url()).pathname).toBe('/p/0')
      expect(
        await browser.eval(
          `document.querySelectorAll('img[alt="small photos on the bottom"]').length`
        )
      ).toBe(2)
    })

    await browser.keydown('ArrowRight')
    await retry(async () => {
      expect(new URL(await browser.url()).pathname).toBe('/p/1')
      expect(
        await browser.eval(
          `document.querySelectorAll('img[alt="small photos on the bottom"]').length`
        )
      ).toBe(2)
    })
  })
})
