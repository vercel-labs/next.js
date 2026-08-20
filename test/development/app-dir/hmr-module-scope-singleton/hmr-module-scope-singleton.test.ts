import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'
import cheerio from 'cheerio'

describe('hmr-module-scope-singleton', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  // https://github.com/vercel/next.js/issues/45483
  it('should not leak module scope resources when the module is updated', async () => {
    async function getState() {
      const $ = cheerio.load(await next.render('/'))
      return {
        marker: $('#marker').text(),
        connectionId: $('#connection-id').text(),
        connectionsOpened: $('#connections-opened').text(),
      }
    }

    const initial = await getState()
    expect(initial.marker).toBe('initial')

    // Repeatedly editing the module that creates the resource must not keep
    // creating new ones, since the previous ones are never disposed.
    for (const edit of ['edit-1', 'edit-2', 'edit-3']) {
      await next.patchFile('lib/db.ts', (content) =>
        content.replace(
          /export const marker = '[^']*'/,
          `export const marker = '${edit}'`
        )
      )

      await retry(async () => {
        expect((await getState()).marker).toBe(edit)
      })
    }

    const final = await getState()
    expect(final.connectionsOpened).toBe(initial.connectionsOpened)
    expect(final.connectionId).toBe(initial.connectionId)
  })
})
