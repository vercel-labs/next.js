# Repro: `fetchCache: 'only-cache'` errors on `cache: 'no-store'` but not on `cache: 'no-cache'` / `next: { revalidate: 0 }`

Issue: https://github.com/vercel/next.js/issues/52458

Docs say `cache: 'no-cache'` "behaves the same way as `no-store` in Next.js", and that
`fetchCache: 'only-cache'` errors "if any fetch requests use `cache: 'no-store'`".
In practice only the literal `'no-store'` string is checked.

## Run

```bash
npm install
npx next build          # fails only on /no-store
```

Pages (all export `fetchCache = 'only-cache'`):
- `app/no-store` -> build error `cache: 'no-store' used on fetch for https://example.com/ with 'export const fetchCache = 'only-cache'` (E521)
- `app/no-cache` -> no error, page is rendered dynamically (uncached fetch)
- `app/revalidate-0` -> no error, page is rendered dynamically (uncached fetch)

Remove/rename `app/no-store` and `next build` succeeds, with `/no-cache` and `/revalidate-0`
listed as `ƒ (Dynamic)`.

Verified with next 16.3.1. Source: `next/dist/server/lib/patch-fetch.js`, `case 'only-cache':`
only throws when `currentFetchCacheConfig === 'no-store'`.
