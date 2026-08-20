# Reproduction for vercel/next.js#49427 — app router scroll position not reset

Minimal app-router repro. Every route is a dynamic segment whose first DOM element is
`position: sticky` / `position: fixed`, plus a variant that navigates with a URL hash
that has **no** matching element in the target page.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
npm run test:scroll    # sticky / fixed / <title> / catch-all variants
npm run test:hash      # client nav with a hash that does not exist in the target page
```

`test.mjs` / `test2.mjs` are Playwright scripts (`npx playwright install chromium` first).
They scroll to y=2000, click a link to a different dynamic segment and print `window.scrollY`.

## Results

| variant | next@13.4.1 | next@15.5.4 | next@16.3.1-canary.25 (dev + prod) |
| --- | --- | --- | --- |
| sticky first child, no hash | 2000 (bug) | 0 | 0 |
| fixed first child, no hash | 2000 (bug) | 0 | 0 |
| inline `<title>` first child | 0 | 0 | 0 |
| nav to `/missinghash/b#no-such-anchor` | – | 66 | **2000 (bug)** |
| same URL as a full page load (browser baseline) | – | 0 | 0 |

The originally reported sticky/fixed `findDOMNode` case is fixed on canary.
Still broken on canary: client-side navigation to a different dynamic segment when the
URL contains a hash with no matching element keeps the previous scroll position, while a
full page load of the same URL scrolls to the top.

`layout-router` bails out on a missing hash target without resetting scroll:

```js
instance = getHashFragmentDomNode(hashFragment)
if (instance === null) {
  scrollRef.current = false
  scrollHandlerRef.onlyHashChange = false
  scrollHandlerRef.hashFragment = null
  return // <- no scroll reset
}
```
