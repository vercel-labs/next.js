# Repro attempt for vercel/next.js#86421

RTK Query + Next.js 16 (App Router, client component) passing a **new object literal**
`{ page, search }` to `useFindBrandsQuery` on every render (no `useMemo`).

## Run

```bash
pnpm install
pnpm build && pnpm start   # http://localhost:3000
# or: pnpm dev
node test.mjs              # Playwright driver, logs /api/brands requests
```

## Result

Refetch works. Clicking "next page" and typing in the search box each trigger a new
`/api/brands` request and update the rendered data (verified on next 16.0.3 dev + prod
and 16.3.1 prod, react 19.2.0, @reduxjs/toolkit 2.x). RTK Query serializes query args
with a stable-key serializer, so a fresh object identity does not prevent refetching.
