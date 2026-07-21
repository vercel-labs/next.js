import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('app dir ISR index cache key', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  function getGeneration(html: string) {
    const match = html.match(/data-generation="(\d+)"/)
    if (!match) throw new Error('Missing home generation')
    return Number(match[1])
  }

  it('does not let a not-found /index request poison the home cache', async () => {
    const initialHome = await next.fetch('/')
    expect(initialHome.status).toBe(200)
    const initialGeneration = getGeneration(await initialHome.text())

    let currentGeneration = initialGeneration
    await retry(async () => {
      const home = await next.fetch('/')
      expect(home.status).toBe(200)
      currentGeneration = getGeneration(await home.text())
      expect(currentGeneration).toBeGreaterThan(initialGeneration)
    }, 5000)

    await retry(
      () => {
        expect(Date.now()).toBeGreaterThanOrEqual(currentGeneration + 1000)
      },
      3000,
      100
    )

    await (await next.fetch('/index')).text()
    await retry(async () => {
      const index = await next.fetch('/index')
      expect(index.status).toBe(404)
      await index.text()
    }, 5000)

    const finalHome = await next.fetch('/')
    expect(finalHome.status).toBe(200)
    expect(getGeneration(await finalHome.text())).toBeGreaterThan(0)
  })
})
