# Repro: `"use cache"` runs at build time; `connection()` is rejected inside it (next#86686)

Next.js 16.3.1, `cacheComponents: true`. A fake DB (`db.ts`) throws `DB_UNREACHABLE`
unless `DATABASE_AVAILABLE=1`, simulating a build environment without DB access.

```bash
npm install

# 1) fails: cached DB query is prerendered at build time, and connection() is
#    disallowed inside "use cache"
npm run build:broken

# 2) succeeds without DB access: connection() in an uncached component under
#    Suspense defers the cached call to runtime
npm run build
DATABASE_AVAILABLE=1 npm start   # /deferred queries the DB per request
```

Routes (the failing ones are `page.broken.tsx`, enabled via `REPRO=broken` +
`pageExtensions`):

- `app/page.broken.tsx` - `"use cache"` with no dynamic context -> build error `DB_UNREACHABLE`
- `app/connection-inside-cache/page.broken.tsx` - `await connection()` inside `"use cache"` ->
  ``Route /connection-inside-cache used `connection()` inside "use cache"``
- `app/deferred/page.tsx` - documented workaround, builds with no DB, resolves at runtime
