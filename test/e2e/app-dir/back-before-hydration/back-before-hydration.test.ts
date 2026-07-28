import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'
import type * as Playwright from 'playwright'

describe('back-before-hydration', () => {
  const { next } = nextTestSetup({ files: __dirname })

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
        for (const release of stalledScripts) release()
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

        const traversedTree = await page.evaluate(() =>
          JSON.stringify(window.history.state?.__PRIVATE_NEXTJS_INTERNALS_TREE)
        )

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
        await page.waitForFunction(
          () => (globalThis as any).__NEXT_HYDRATED === true
        )
        // Let hydration's visual updates paint before checking the observer.
        await page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              requestAnimationFrame(() =>
                requestAnimationFrame(() => resolve())
              )
            })
        )

        // A replay-capable router preserves the traversed history tree during
        // hydration and should then recover the traversed-to Home page.
        const hasTraversalReplay = await page.evaluate(
          (tree) =>
            JSON.stringify(
              window.history.state?.__PRIVATE_NEXTJS_INTERNALS_TREE
            ) === tree,
          traversedTree
        )

        if (hasTraversalReplay) {
          // Wait until replay either recovers or manifests the reported blank
          // page. Keep this independent of the blank-frame assertion below.
          await retry(async () => {
            const state = await page.evaluate(() => ({
              sawBlankFrame: (window as any).__sawBlankFrame as boolean,
              homeIsVisible:
                document.querySelector<HTMLElement>('#home')?.offsetParent !==
                null,
            }))
            expect(state.sawBlankFrame || state.homeIsVisible).toBe(true)
          }, 5_000)
        }

        expect(await page.evaluate(() => (window as any).__sawBlankFrame)).toBe(
          false
        )

        if (hasTraversalReplay) {
          expect(
            await page.evaluate(
              () =>
                document.querySelector<HTMLElement>('#home')?.offsetParent !==
                null
            )
          ).toBe(true)
        }
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
