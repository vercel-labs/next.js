# Repro: `<details open>` does not fire `onToggle` on mount in Next.js (issue #69881)

Minimal reproduction of https://github.com/vercel/next.js/issues/69881 on `next@canary` (verified with 16.3.1-canary.25, React 19.2.0), App Router, both `next dev` and `next build && next start`.

## Routes

| Route | Markup source | `toggle` on load |
| --- | --- | --- |
| `/` | client component `<details open onToggle>` rendered in SSR HTML | ❌ not fired |
| `/csr` | same JSX, mounted only after `useEffect` (not in SSR HTML) | ✅ fired |
| `/plain.html` | plain HTML, listener attached in inline script right after the element | ✅ fired |
| `/plain-deferred.html` | plain HTML, listener attached in `setTimeout(..., 0)` | ❌ not fired |

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm run start &   # or: npm run dev
npm test                           # Playwright: collects console logs per route
```

`npm test` prints, for each route, whether `TOGGLE_FIRED` was logged and screenshots into
`.next-maintainer/reproduction-artifacts/playwright` (path configurable in `check.mjs`).

## Observation

The element is already `open` in the server-rendered HTML, so the browser dispatches `toggle`
in a task that runs before React hydration attaches the listener; the handler never runs.
`/plain-deferred.html` shows the identical miss in plain HTML with no React involved, i.e. the
behaviour comes from SSR + late listener attachment rather than from Next.js event handling.
