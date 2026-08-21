# Reproduction: refreshing the page while `router.refresh()` is in flight triggers an error boundary

Upstream issue: https://github.com/vercel/next.js/issues/87681 (Next.js 16.1.1, React 19.2.3)

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start &   # or: npm run dev
npm run repro
```

## Manual steps

1. Open http://localhost:3000 and wait for `slow data …`.
2. Click **1. router.refresh()** — the RSC response streams for ~4s.
3. While it is streaming, reload the page (button 2, or press Cmd/Ctrl-R,
   which aborts in-flight requests before navigating).

## Observed

The aborted `router.refresh()` stream rejects with `TypeError: network error`,
React logs *"The above error occurred in the `<Slow>` component. It was handled
by the `<ErrorBoundaryHandler>` error boundary."* and `app/error.js` renders.

Same result with `next dev` and with `next build && next start`.

## Expected

An aborted/superseded `router.refresh()` request should be discarded silently
instead of throwing into the nearest error boundary.
