import { nextTestSetup } from 'e2e-utils'
import cheerio from 'cheerio'

// Regression test for https://github.com/vercel/next.js/issues/53724
// Adding the Pages Router `i18n` config strips the locale prefix before App
// Router matching, so App Router routes that carry the locale as a dynamic
// segment (`app/[locale]/...`) can never be matched and return a 404.
describe('i18n config with app router locale segment', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it.each([
    { pathname: '/de', expected: 'app/[locale]/page.js locale: de' },
    {
      pathname: '/de/localized-route',
      expected: 'app/[locale]/localized-route/page.js locale: de',
    },
  ])(
    'resolves $pathname to the app router page',
    async ({ pathname, expected }) => {
      const res = await next.fetch(pathname, { redirect: 'manual' })
      expect(res.status).toBe(200)

      const $ = cheerio.load(await res.text())
      expect($('#page').text()).toBe(expected)
    }
  )

  it('still resolves app router routes without a locale segment', async () => {
    const res = await next.fetch('/unlocalized-route', { redirect: 'manual' })
    expect(res.status).toBe(200)

    const $ = cheerio.load(await res.text())
    expect($('#page').text()).toBe('app/unlocalized-route/page.js')
  })

  it('still resolves locale prefixed pages router routes', async () => {
    const res = await next.fetch('/de/pages-route', { redirect: 'manual' })
    expect(res.status).toBe(200)

    const $ = cheerio.load(await res.text())
    expect($('#page').text()).toBe('pages/pages-route.js')
  })
})
