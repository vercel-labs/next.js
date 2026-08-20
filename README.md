# Repro: next/link does not scroll to top when a sticky header is taller than current scroll offset (vercel/next.js#64441)

Verified with Next.js 16.3.1 (`next dev` and `next build && next start`), React 19, Chromium via Playwright.

## Setup
```
npm install
npx playwright install chromium
npm run dev          # or: npm run build && npm start
npx playwright test
```

## What happens
`app/layout.tsx` renders a `position: sticky; top: 0; height: 200px` header.

- Scroll to `window.scrollY = 100` (less than header height) on `/page-a`, click the `Page B` link:
  route changes but `window.scrollY` stays `100`. **Expected 0.**
- Scroll to `window.scrollY = 500` (greater than header height), click `Page B`:
  `window.scrollY` becomes `0` as expected.

`topOfElementInViewport()` in `packages/next/src/client/components/layout-router.tsx`
considers the new page's top element "in viewport" even though the sticky header overlaps it,
so the scroll reset is skipped.
