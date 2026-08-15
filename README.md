# Reproduction — vercel/next.js#97354

React **error #310 ("Rendered more hooks than during the previous render")** thrown from the
App Router `Router` component in a **production** build, with the exact minified frames from
the issue report:

```
Error: Minified React error #310
    at Object.ol [as useMemo]
    at r.useMemo
    at L                       <-- app-router.js  Router
```

## Run

```bash
npm install
npm run build
npm start                      # in another shell:
npx playwright install chromium
node check.mjs                 # -> "5/5 loads threw React error #310"
```

Or open http://localhost:3000 with "Preserve log" enabled in DevTools.
`npm run dev` does not show it — a production build is required.

## Ingredients

* `app/providers.tsx` — client provider firing a Server Action (`getAuth()`) from `useEffect`
  on mount, so a router action is pending while the route renders.
* `app/layout.tsx` — a `<Suspense>` boundary around the route.
* `app/page.tsx` — server component ending its render with an App Router control-flow throw
  (`redirect("/dashboard")`; `notFound()` is the same code path).

`useActionQueue` (`next/dist/client/components/use-action-queue.js:139`) calls `use(state)`
on the pending router state and suspends **after** recording 3 hooks and **before** `Router`'s
own `useMemo` at `app-router.js:116` — exactly the hook accounting reported in #97354
(`wipHooks=3 altHooks=3 throwingHookIndex=4`). React then commits that incomplete tree while
recovering from the concurrent error and the next render throws #310.

## Version matrix (verified locally, `next build && next start`, Turbopack)

| next | bundled react-dom | result |
|---|---|---|
| 16.2.12 | `19.3.0-canary-3f0b9e61-20260317` | **5/5 loads throw #310** |
| 16.3.1  | `19.3.0-canary-cbb046ab-20260731` | 0/5 — clean |

`use-action-queue.js` is byte-identical between those releases; the difference is in React,
which now treats `RootSuspendedAtTheShell` as an errored render inside
`recoverFromConcurrentError` so an incomplete tree is no longer committed.

Check the fixed version with: `npm i next@16.3.1 && npm run build && npm start && node check.mjs`.

## Notes

* Derived from the public repro in vercel/next.js#78396
  (github.com/moroshko/rendered-more-hooks-issue), updated to next@16.2.12 / react 19.2.0 —
  the versions reported in #97354.
* `app/(main)/items/[id]` is the literal `notFound()`-on-a-dynamic-route variant. It does
  **not** crash on its own (`/items/missing` renders its boundary; 0/27 loads across
  server-action-delay sweeps). The crash needs a router action pending while the errored
  render is recovered, which `redirect()` provides deterministically.
* `repro.mjs` just re-exports `check.mjs`.
