# Repro: vercel/next.js#68596 — `<Link legacyBehavior>` forces memoized child to re-render on query-only navigations

## Run

```bash
npm install
npx playwright install chromium
npm run dev          # or: npm run build && npm start
npm run check        # drives the page with Playwright and prints render counts
```

`check.js` loads `/`, clicks `#update-time` three times (each click does
`router.push({ query: { t: Date.now() } }, undefined, { shallow: true })`)
and prints the render counter of two `React.memo` buttons:

- `#link-child` — wrapped in `<Link href="/other" legacyBehavior passHref>`
- `#plain-child` — identical memoized button, not wrapped

## Observed (next 16.3.1, pages router)

```
initial        link renders: 2   plain renders: 1
after click 1  link renders: 3   plain renders: 1
after click 2  link renders: 4   plain renders: 1
after click 3  link renders: 5   plain renders: 1
```

The memoized child under `Link` re-renders on every query-only navigation, the
control never does.

## Cause

`next/link` reads the pages `RouterContext` (whose value changes on every route
state update) and rebuilds `childProps.onClick` / `onMouseEnter` / `onTouchStart`
inline on every render, so `React.memo` on the child can never bail out.
See `packages/next/src/client/link.tsx` (`const childProps = { ... }`).
