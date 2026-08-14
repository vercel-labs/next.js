# Reproduction for vercel/next.js#97354

React error #310 ("Rendered more hooks than during the previous render") thrown from
`Router` (`next/dist/client/components/app-router.js`) when loading a dynamic route that
calls `notFound()`. The route's `not-found.tsx` never paints; the user gets Next.js'
"This page couldn't load" screen.

## Ingredients (all required)

1. Root layout renders a **client** provider that dispatches a **Server Action on mount**
   (`app/providers.tsx` -> `getAuth()`, 2s) and then calls **`router.refresh()` while that
   action is still in flight**.
2. A `<Suspense>` boundary between the provider and the route (`app/(main)/layout.tsx`).
3. A dynamic route that calls `notFound()` (`app/(main)/items/[id]/page.tsx`) with its own
   `not-found.tsx`.

## Steps

```bash
npm install
npm run build
npm start
# open http://localhost:3000/items/missing
```

Expected: the `not-found.tsx` boundary ("route not-found boundary").
Actual: "This page couldn't load" + `Minified React error #310` in the console, with

```
at Object.ol [as useMemo]
at r.useMemo
at L            <-- Router, app-router.js
```

`http://localhost:3000/items/a` (an existing id) is unaffected. `npm run dev` shows the
same crash with the unminified message and `at Router (.../app-router.js)`.

Automated check (10/10 crashes here):

```bash
npm install playwright && npx playwright install chromium
node repro.mjs        # loads /items/missing 10x, prints hits=N/10
```

## Versions

- Crashes: `next@16.2.12` and `next@16.2.2`, react/react-dom `19.2.0`, Turbopack build, prod and dev.
- Does **not** crash: `next@16.3.0`, `next@16.3.1-canary.16` (same app, same app-level React;
  Next's bundled React differs: `19.3.0-canary-3f0b9e61-20260317` in 16.2.12 vs
  `19.3.0-canary-cbb046ab-20260731` in 16.3.0).
