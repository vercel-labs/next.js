import { nextTestSetup } from 'e2e-utils'
import cheerio from 'cheerio'

describe('output: export - next/image with basePath', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    // `next start` does not work with `output: 'export'`.
    skipStart: true,
  })

  it('should prefix basePath to unoptimized public images', async () => {
    const { exitCode } = await next.build()
    expect(exitCode).toBe(0)

    const $ = cheerio.load(await next.readFile('out/index.html'))
    expect($('img[alt="logo"]').attr('src')).toBe('/bug/logo.svg')
  })
})
