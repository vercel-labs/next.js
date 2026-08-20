# Reproduction for vercel/next.js#56344 — "Loading page mismatch in app router directory"

Route tree (same shape as the report, plus a nested-dynamic variant):

```
app/blog/loading.tsx            -> data-loading="blog"
app/blog/page.tsx
app/blog/[slug]/loading.tsx     -> data-loading="slug"
app/blog/[slug]/page.tsx        (3s delay)
app/c/[country]/{loading,page}.tsx           -> data-loading="country"
app/c/[country]/[state]/{loading,page}.tsx   -> data-loading="state"
app/c/[country]/[state]/[city]/{loading,page}.tsx -> data-loading="city"
```

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # terminal 1
BASE=http://localhost:3000 TAG=canary npm run check   # terminal 2
```

`scripts/check-loading.mjs` throttles every request by 1200ms and records which
`loading.tsx` boundaries appear during a client-side navigation.

## Result

* `next@14.2.3` (and 13.5.x, as reported): `FAIL` — `/ -> /blog/x` renders
  `["blog","slug"]` and `/c/us -> /c/us/ca/sf` renders `["state","city"]`;
  the parent `loading.tsx` is displayed for the whole RSC fetch and then swaps
  to the correct one (the "glitch between those loadings" in the issue).
* `next@15.5.4`, `next@16.3.1` and `next@canary` (16.3.1-canary.25): `PASS` —
  only the leaf `loading.tsx` is ever rendered, in dev and in `next build && next start`.

Swap versions with `npm i next@14.2.3 react@18 react-dom@18` to see the failing output.
