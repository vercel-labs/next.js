import { nextTestSetup } from 'e2e-utils'

// Pages router files named like app router metadata route conventions
// (e.g. `sitemap`, `robots`) are regular pages and can use `getStaticProps`.
describe('pages-dir metadata-route-like pages', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should render pages/sitemap with getStaticProps', async () => {
    const $ = await next.render$('/sitemap')
    expect($('h1').text()).toBe('Sitemap: 2')
  })

  it('should render pages/robots with getStaticProps', async () => {
    const $ = await next.render$('/robots')
    expect($('h1').text()).toBe('Robots: 3')
  })
})
