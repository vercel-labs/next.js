# Reproduction attempt for vercel/next.js#92335

"App Router: route groups prefetch cache should isolate parallel slots"

The issue links a Next.js *fork branch* (a proposed `parallelSlot` cache-key patch),
not a runnable reproduction. This app is the minimal user-facing scenario the issue
describes, checked against `next@canary`.

App shape:
- root layout with two parallel slots: `children`, `@analytics`, `@modal`
- two route groups: `(shop)/shop`, `(marketing)/about`, with matching `@analytics/*` slot pages
- an intercepting route `@modal/(.)photo/[id]` plus the real `photo/[id]` page
- pages print a random render id so a reused prefetch/back-forward cache entry is visible

## Run

```bash
npm install
npx playwright install chromium --with-deps
npm run build
npm start &            # http://localhost:3111
npx playwright test
```

## Result (next@16.3.1-canary.26)

Both tests pass: prefetch + soft navigation + browser back/forward restore the
correct tree in each parallel slot, cached entries are reused (identical render id
on back) and the intercepted `@modal` entry never leaks into the non-intercepted
(hard load) render of the same URL. No cross-parallel-slot route-cache sharing
was observed.
