# Reproduction — vercel/next.js#97354

React **error #310 ("Rendered more hooks than during the previous render")** thrown from
the App Router `Router` component in a **production** build, with the exact minified frames
reported in the issue:

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
npm start            # in another shell:
npx playwright install chromium
node check.mjs       # -> "5/5 loads threw React error #310"
```

Or open http://localhost:3000 with "Preserve log" enabled in DevTools.
Dev mode (`npm run dev`) does not show it; a production build is required.

## Ingredients

* `app/components/Providers/Providers.tsx` — client provider that fires a Server Action
  (`getAuth()`) from `useEffect` on mount.
* `app/(signed-in)/layout.tsx` — a `<Suspense>` boundary around the route.
* `app/(signed-in)/(home)/page.tsx` — a server component that ends the render with an
  App Router control-flow throw (`redirect("/dashboard")`; `notFound()` is the same
  code path in the issue report).

The Server Action / navigation leaves the router state as a pending thenable, so
`useActionQueue` (`next/dist/client/components/use-action-queue.js:139`) calls
`use(state)` and suspends **after** recording 3 hooks and **before** `Router`'s own
`useMemo` at `app-router.js:116` — the hook accounting described in #97354
(`wipHooks=3 altHooks=3 throwingHookIndex=4`).

## Version matrix (verified locally, `next build && next start`, Turbopack)

| next | bundled react-dom | result |
|---|---|---|
| 16.2.12 | `19.3.0-canary-3f0b9e61-20260317` | **5/5 loads throw #310** |
| 16.3.1  | `19.3.0-canary-cbb046ab-20260731` | 0/5 — clean |

The difference is in React, not in `use-action-queue.js` (byte-identical across those
releases): the newer canary treats `RootSuspendedAtTheShell` as an errored render inside
`recoverFromConcurrentError`, so an incomplete tree (a `Router` fiber whose hook list was
truncated by the `use()` suspension) is no longer committed.

To check the fixed version: `npm i next@16.3.1 && npm run build && npm start && node check.mjs`.

## Notes

* Derived from the public repro in vercel/next.js#78396
  (github.com/moroshko/rendered-more-hooks-issue), updated to next@16.2.12 / react 19.2.0,
  the versions reported in #97354.
* Variants using `notFound()` on a dynamic route with its own `not-found.tsx` did **not**
  crash in isolation here (0/27 loads across server-action-delay sweeps); the crash needs a
  router action pending while the errored render is recovered, which `redirect()` provides
  deterministically.
