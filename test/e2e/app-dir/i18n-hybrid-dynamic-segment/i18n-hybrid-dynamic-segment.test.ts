import { nextTestSetup } from 'e2e-utils'
import cheerio from 'cheerio'

const { i18n } = require('./next.config')

describe('i18n-hybrid-dynamic-segment', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('resolves an App Router dynamic segment that is not a configured locale', async () => {
    const res = await next.fetch('/foo/test', { redirect: 'manual' })
    expect(res.status).toBe(200)

    const $ = cheerio.load(await res.text())
    expect($('#lang').text()).toBe('foo')
  })

  it.each(i18n.locales)(
    'resolves an App Router dynamic segment matching the configured locale %s',
    async (locale: string) => {
      const res = await next.fetch(`/${locale}/test`, { redirect: 'manual' })
      expect(res.status).toBe(200)

      const $ = cheerio.load(await res.text())
      expect($('#lang').text()).toBe(locale)
    }
  )
})
