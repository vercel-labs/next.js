# Repro: `dynamicParams = false` is ignored in production when the page reads `headers()`

Issue: https://github.com/vercel/next.js/issues/54270

`app/[locale]/page.tsx` sets `export const dynamicParams = false` and
`generateStaticParams()` returns only `{locale: 'en'}`.

## Run

```bash
npm install
npm run build && npm start   # prod: GET /de -> 200 with "Hello de!"  (BUG, expected 404)
npm run dev                  # dev:  GET /de -> 404 not-found        (expected)
```

Control: delete the `await headers()` line in `app/[locale]/page.tsx`, rebuild,
and prod `GET /de` correctly returns 404. Any dynamic API (`headers()`,
`cookies()`, `searchParams`) that opts the segment out of static generation makes
`dynamicParams = false` a no-op in production, so unknown params are rendered
instead of hitting the closest `not-found`.

Reproduced with next@16.3.1-canary.24 and next@15.6.0-canary.10.
