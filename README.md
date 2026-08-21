# Repro: next build fails on `force-dynamic` route with module-level env access (vercel/next.js#77436)

Original reporter repo (https://github.com/mcorbelli/hello-world) is 404 (private/deleted),
so this is a minimal standalone reproduction of the reported behavior.

`app/api/auth/[...all]/route.js` sets `export const dynamic = 'force-dynamic'` and imports
`lib/db.js`, which throws at module evaluation when `DATABASE_URL` is unset (standing in for
Prisma/BetterAuth doing a DB-backed setup at import time).

## Run

```bash
npm install
env -u DATABASE_URL npx next build   # fails
DATABASE_URL=postgres://x npx next build  # succeeds
```

## Result

Build fails during "Collecting page data" even though the route is `force-dynamic`:

```
Error: Invalid `prisma.setting.findMany()` invocation: error: Environment variable not found: DATABASE_URL.
> Build error occurred
[Error: Failed to collect page data for /api/auth/[...all]]
```

Reproduces on next@15.2.3 (reported version) and next@16.3.1-canary.26.
