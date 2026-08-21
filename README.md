# Repro: `dynamic = 'force-dynamic'` page defeats ancestor `dynamic = 'force-static'` layout

Next.js 16.0.2-canary.32 (Turbopack), Node 24.

## Run

```bash
npm install
npm run build     # /nested is marked ƒ (Dynamic)
npm start
curl -A "MyAgent/1.0" http://localhost:3000/nested   # layout timestamp changes each request, headerCount: 0
curl -A "MyAgent/1.0" http://localhost:3000/control  # userAgent: "MyAgent/1.0"
```

## Layout

- `app/nested/layout.tsx` — `export const dynamic = 'force-static'`, prints `Date.now()`
- `app/nested/page.tsx` — `export const dynamic = 'force-dynamic'`, prints `headers()` info
- `app/control/page.tsx` — `export const dynamic = 'force-dynamic'` with no `force-static` ancestor (control)

## Observed

1. The `force-static` layout's `Date.now()` changes on every request to `/nested`: the whole
   route branch renders dynamically per request, the layout is never prerendered.
2. Inside the `force-dynamic` page, `headers()` returns **0 headers / `userAgent: null`**, while
   `/control` returns the real `user-agent`. The ancestor layout's `force-static` wins for request
   APIs (`workStore.forceStatic` short-circuit in `packages/next/src/server/request/headers.ts`),
   even though the route itself is served dynamically.

Both flags are set on the single shared `workStore` in
`packages/next/src/server/app-render/create-component-tree.tsx`, so `forceStatic` from the ancestor
and `forceDynamic` from the page coexist, contradicting the "nested most config wins" comment there.
