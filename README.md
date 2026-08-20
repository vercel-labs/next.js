# Repro: vercel/next.js#61195 — no way to exclude route handlers from `output: 'export'`

## Run

```bash
npm install
npm run build
```

## Expected
A way to keep dynamic route handlers in the codebase (used in SSR mode) while
building with `output: 'export'` (e.g. `export const dynamic = 'exclude-from-output-export'`).

## Actual (Next 16.3.1)
`next build` fails.

- `app/api/route.ts` (dynamic GET + POST "Next 14 workaround"):
  `Error: export const dynamic = "force-static"/export const revalidate not configured on route "/api" with "output: export"`
  → `Failed to collect page data for /api`
- `app/api-force-static/route.ts` (`dynamic = 'force-static'` and reads `nextUrl.searchParams`):
  `Error: Route /api-force-static with 'dynamic = "error"' couldn't be rendered statically because it used 'nextUrl.searchParams'.`

Remove/rename either route to observe the other error.
