# Reproduction — vercel/next.js#97777

React error #310 ("Rendered more hooks than during the previous render") thrown from App
Router's own `Router` component (`client/components/app-router.js`), whose hook chain starts
with `useActionQueue` (`useState` → `useOptimistic` → `useMemo` → conditional `use(state)`).

Production build only; never in `next dev`.

## Ingredients

- `app/layout.tsx` → client `Providers` fires a **server function** from `useEffect` on mount
  (this dispatches into the App Router action queue, so the router state becomes a thenable
  that `useActionQueue` unwraps with `use()`).
- `app/(signed-in)/layout.tsx` → wraps children in `<Suspense>`.
- `app/(signed-in)/(home)/page.tsx` → server component that `redirect()`s to `/dashboard`.

So a router action is in flight while a redirect resolves → `Router` re-renders with a hook
chain that is out of sync with the committed one → #310.

Adapted from the reproduction in vercel/next.js#78396 (react/react#33556), retested on the
version reported in #97777.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start          # in one shell
npm run check      # in another shell: 5 fresh page loads of "/"
```

`npm run check` prints the uncaught error for each load. Manually: open
<http://localhost:3000/> in a fresh tab with the console open (a `console.log` from
`addEventListener('error', ...)` also captures it).

## Result

| next | vendored react-dom | uncaught #310 on load of `/` |
| --- | --- | --- |
| 16.2.12 (pinned here) | 19.3.0-canary-3f0b9e61-20260317 | 17/17 loads |
| 16.3.2 | 19.3.0-canary-cbb046ab-20260731 | 0/8 loads |
| 16.4.0-canary.3 | 19.3.0-canary-eafeac09-20260819 | 0/18 loads |

Stack on 16.2.12 (minified, prod):

```
Error: Minified React error #310
    at aP (chunks/…js)                 <- updateWorkInProgressHook
    at Object.ol [as useMemo] (…)
    at r.useMemo (…)
    at L (…)                           <- Router (app-router.js)
    at ay (…)                          <- renderWithHooks
```

`L` is `Router`: the chunk text at that offset is
`function L({actionQueue,globalError,webSocket,staticIndicatorState}){let l,s=(0,f.useActionQueue)(e),…}`.
