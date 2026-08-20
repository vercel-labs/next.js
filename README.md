# Repro: `React.cache()` + `generateMetadata()` (next.js#62162)

Minimal app: root `layout.tsx` has `generateMetadata()` and the layout render, both
awaiting the same `cache()`-wrapped function. Two child routes: one with `loading.tsx`,
one without.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
node nav.mjs http://localhost:3000   # optional: playwright hover+click both links
```

Watch the dev-server stdout for `[generateMetadata root layout]`, `[render root layout]`
and `[CACHED-FN EXECUTED, total executions since server start = N]`.

## Observed on next@16.3.1-canary.25 (React 19.2)

* Initial `GET /`: `generateMetadata` and the layout render both call `cachedFn()` but it
  executes **once** -> `cache()` is shared between `generateMetadata` and rendering, so the
  Next.js docs statement is correct (contrary to the issue title's concern).
* Client navigation to `/with-loading` (has `loading.tsx`) and `/without-loading`: root
  `generateMetadata` runs exactly **once per navigation** in both cases.

## Observed on the reporter's repro (next@14.1.1-canary.70)

Navigating to the route that has `loading.tsx` logged `generateMetadata` + cached fn
**twice** (prefetch RSC request + navigation RSC request), while the route without
`loading.tsx` logged it once. That extra call no longer happens on current canary.

To check the old behaviour: `npm i next@14.1.1-canary.70 react@18 react-dom@18`, remove
`await connection()` (use `unstable_noStore()`), and repeat.

Note: the root layout's `generateMetadata()` re-running on every navigation is expected
(parent metadata/`title.template` must be resolved for each navigation).
