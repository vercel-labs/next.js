import { instant } from '../../packages/next-playwright/src/index'

const INSTANT_COOKIE = 'next-instant-navigation-testing'

type StoredCookie = {
  name: string
  value: string
  domain: string
  path: string
}

/**
 * Minimal stand-in for a Playwright BrowserContext cookie jar. Entries are
 * keyed by (name, domain, path) — the same identity Playwright/Chromium uses —
 * and an entry whose `expires` is in the past is removed instead of stored,
 * which is how `instant()` deletes the instant cookie.
 *
 * A fake jar (rather than a real browser) keeps this test focused on the part
 * that regressed: which entries `instant()` selects for deletion.
 */
class FakeBrowserContext {
  cookieJar: StoredCookie[] = []

  async addCookies(
    cookies: Array<{
      name: string
      value: string
      url?: string
      domain?: string
      path?: string
      expires?: number
    }>
  ): Promise<void> {
    for (const cookie of cookies) {
      const domain = cookie.domain ?? new URL(cookie.url!).hostname
      const path = cookie.path ?? '/'
      const index = this.cookieJar.findIndex(
        (stored) =>
          stored.name === cookie.name &&
          stored.domain === domain &&
          stored.path === path
      )
      if (index !== -1) {
        this.cookieJar.splice(index, 1)
      }
      const expired =
        cookie.expires !== undefined &&
        cookie.expires !== -1 &&
        cookie.expires * 1000 <= Date.now()
      if (!expired) {
        this.cookieJar.push({
          name: cookie.name,
          value: cookie.value,
          domain,
          path,
        })
      }
    }
  }

  async cookies(): Promise<StoredCookie[]> {
    return this.cookieJar.map((cookie) => ({ ...cookie }))
  }
}

function createPage(context: FakeBrowserContext) {
  return {
    url: () => 'about:blank',
    context: () => context as any,
  }
}

function findCookie(context: FakeBrowserContext, domain: string) {
  return context.cookieJar.find(
    (cookie) => cookie.name === INSTANT_COOKIE && cookie.domain === domain
  )
}

describe('@next/playwright instant() cookie scope', () => {
  it('leaves instant cookies of other applications untouched', async () => {
    const context = new FakeBrowserContext()
    const page = createPage(context)

    // Another application in the same browser context is inside its own
    // instant() scope, so its instant cookie is present in the shared jar.
    const appBValue = JSON.stringify([1, 'app-b', null])
    await context.addCookies([
      {
        name: INSTANT_COOKIE,
        value: appBValue,
        domain: 'app-b.example',
        path: '/',
      },
    ])

    let appBCookieDuringScope: StoredCookie | undefined
    let appACookieDuringScope: StoredCookie | undefined
    await instant(
      page,
      async () => {
        appBCookieDuringScope = findCookie(context, 'app-b.example')
        appACookieDuringScope = findCookie(context, 'app-a.example')
      },
      { baseURL: 'https://app-a.example/' }
    )

    // The scope must acquire the lock for its own application...
    expect(appACookieDuringScope).toBeDefined()
    // ...without clearing the unrelated application's cookie.
    expect(appBCookieDuringScope?.value).toBe(appBValue)

    // Releasing the scope only deletes this application's cookie.
    expect(findCookie(context, 'app-a.example')).toBeUndefined()
    expect(findCookie(context, 'app-b.example')?.value).toBe(appBValue)
  })

  it('still clears a stale instant cookie of its own application', async () => {
    const context = new FakeBrowserContext()
    const page = createPage(context)

    await context.addCookies([
      {
        name: INSTANT_COOKIE,
        value: JSON.stringify([1, 'stale', null]),
        domain: 'app-a.example',
        path: '/',
      },
    ])

    let valueDuringScope: string | undefined
    await instant(
      page,
      async () => {
        valueDuringScope = findCookie(context, 'app-a.example')?.value
      },
      { baseURL: 'https://app-a.example/' }
    )

    // The stale entry was replaced by a fresh lock, then cleaned up on exit.
    expect(valueDuringScope).toBeDefined()
    expect(valueDuringScope).not.toContain('stale')
    expect(findCookie(context, 'app-a.example')).toBeUndefined()
  })
})
