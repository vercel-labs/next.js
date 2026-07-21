import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'
import type * as Playwright from 'playwright'

describe('back-before-hydration', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  async function runScenario() {
    let page: Playwright.Page
    const browser = await next.browser('/', {
      beforePageLoad(p: Playwright.Page) {
        page = p
      },
    })

    try {
      // Confirm the first navigation is handled by the hydrated router, so the
      // two entries belong to the same document's history.
      await page.evaluate(() => ((window as any).__sameDocument = true))
      await page.locator('#to-post').click()
      await page.locator('#post').waitFor({ state: 'visible' })
      expect(await page.evaluate(() => (window as any).__sameDocument)).toBe(
        true
      )

      let stalling = true
      const stalledScripts = new Set<() => void>()
      const releaseScripts = () => {
        stalling = false
        for (const release of stalledScripts) {
          release()
        }
        stalledScripts.clear()
      }

      await page.route('**/_next/static/**', async (route) => {
        if (stalling && route.request().resourceType() === 'script') {
          await new Promise<void>((resolve) => stalledScripts.add(resolve))
        }
        await route.continue()
      })

      try {
        // Commit a new document, but prevent it from hydrating before the Back
        // traversal is delivered.
        await page.reload({ waitUntil: 'commit' })
        await page.goBack({ waitUntil: 'commit' })
        expect(new URL(page.url()).pathname).toBe('/')

        // Observe every rendered frame during recovery. The reloaded page may
        // remain visible until Home is ready, but there must not be a blank
        // frame between them.
        await page.evaluate(() => {
          ;(window as any).__sawBlankFrame = false

          function observeFrame() {
            const visibleHeadings = Array.from(
              document.querySelectorAll<HTMLElement>('h1')
            ).filter((element) => element.offsetParent !== null)

            if (visibleHeadings.length === 0) {
              ;(window as any).__sawBlankFrame = true
            }
            if (!visibleHeadings.some((element) => element.id === 'home')) {
              requestAnimationFrame(observeFrame)
            }
          }

          requestAnimationFrame(observeFrame)
        })

        releaseScripts()

        await retry(async () => {
          const visibleHeadings = await page.evaluate(() =>
            Array.from(document.querySelectorAll<HTMLElement>('h1'))
              .filter((element) => element.offsetParent !== null)
              .map((element) => element.id)
          )
          expect(visibleHeadings).toContain('home')
        }, 5_000)
        expect(await page.evaluate(() => (window as any).__sawBlankFrame)).toBe(
          false
        )
        expect(new URL(await browser.url()).pathname).toBe('/')
      } finally {
        releaseScripts()
        await page.unroute('**/_next/static/**')
      }
    } finally {
      await browser.close()
    }
  }

  it('should keep content visible while replaying a back navigation before hydration', async () => {
    // The router may occasionally recover cleanly, so exercise the race a few
    // times to make the regression reliable.
    for (let attempt = 0; attempt < 3; attempt++) {
      await runScenario()
    }
  })
})
