# Repro: Inconsistent 404 handling with parallel routes (vercel/next.js#79352)

Mirror of https://github.com/r4sheed/nextjs-parallel-routes-404-repro, updated to `next@canary`
(the only change is `await params` in `src/app/(main)/@breadcrumb/[...catchAll]/page.tsx`, which
Next 16 requires).

## Run

```bash
npm install
npm run dev
```

## Steps

1. Open http://localhost:3000/ and click `/does-not-exist (should be 404)` -> the custom
   `(main)/not-found.tsx` renders. Correct.
2. Go back to `/`, click `Go to (Main) Group Home Page` (`/main-group-page`), then click
   `/does-not-exist (404 test)` in the layout nav.
   - Expected: `(main)/not-found.tsx`.
   - Actual: URL becomes `/does-not-exist` but the previous page's content (`(Main) Group - Home Page`)
     stays rendered; the RSC request returns 200 and no not-found boundary is shown.
3. A hard reload of `/does-not-exist` returns HTTP 404 and renders the not-found page.

Reproduces in `next dev` and in `next build && next start` on 15.3.2 and 16.3.1-canary.26.
The `@breadcrumb/[...catchAll]` slot is what makes the soft navigation "match", masking the
missing `children` segment.
