import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

const SCROLL_POSITION = 3500

describe('back-button-hash-scroll-restoration', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  async function goToAnotherPageAndBack(
    linkId: string,
    anotherPageLinkId: string
  ) {
    const browser = await next.browser('/')

    await browser.elementById(linkId).click()
    await browser.waitForElementByCss('#anchor')

    // Scroll away from wherever the navigation left us, then leave the page.
    await browser.eval(`window.scrollTo(0, ${SCROLL_POSITION})`)
    await retry(async () =>
      expect(await browser.eval('window.scrollY')).toBe(SCROLL_POSITION)
    )

    await browser.elementById(anotherPageLinkId).click()
    await browser.waitForElementByCss('#another')

    await browser.back()
    await browser.waitForElementByCss('#anchor')

    return browser
  }

  it.each([
    {
      router: 'pages router',
      withoutHash: 'to-pages-test',
      withHash: 'to-pages-test-hash',
      anotherPageLinkId: 'to-another',
    },
    {
      router: 'app router',
      withoutHash: 'to-app-test',
      withHash: 'to-app-test-hash',
      anotherPageLinkId: 'to-another',
    },
  ])(
    'should restore the scroll position on back navigation to a url with a hash ($router)',
    async ({ withoutHash, withHash, anotherPageLinkId }) => {
      // Sanity check: without a hash the scroll position is restored.
      const withoutHashBrowser = await goToAnotherPageAndBack(
        withoutHash,
        anotherPageLinkId
      )
      await retry(async () =>
        expect(await withoutHashBrowser.eval('window.scrollY')).toBe(
          SCROLL_POSITION
        )
      )

      // With a hash in the url the previous scroll position must be restored
      // as well, instead of scrolling to the hash target again.
      const withHashBrowser = await goToAnotherPageAndBack(
        withHash,
        anotherPageLinkId
      )
      expect(await withHashBrowser.url()).toEndWith('#anchor')

      await retry(async () =>
        expect(await withHashBrowser.eval('window.scrollY')).toBe(
          SCROLL_POSITION
        )
      )
    }
  )
})
