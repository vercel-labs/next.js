# Repro: vercel/next.js#86390

Turbopack `next build` crashes with `MODULE_UNPARSABLE` when a Route Handler imports
`notFound` from `next/navigation.js` (with the `.js` extension).

- `app/a/route.ts` -> `import { notFound } from 'next/navigation.js'` (breaks Turbopack build)
- `app/b/route.ts` -> `import { notFound } from 'next/navigation'` (works)

## Run

```bash
npm install
npm run build            # Turbopack: fails -> Failed to collect page data for /a
npm run build:webpack    # webpack: succeeds, /a and /b both return 404 at runtime
```

Removing `app/a` makes the Turbopack build pass, so the trigger is the `.js`-suffixed
subpath import, not `notFound()` itself.

Error:

```
Error: Could not parse module '[project]/node_modules/next/dist/server/route-modules/app-route/vendored/contexts/app-router-context.js', file not found
  code: 'MODULE_UNPARSABLE'
> Build error occurred
Error: Failed to collect page data for /a
```

Reproduced with next 16.0.2-canary.27 and 16.3.1-canary.26 (Node 24, Linux).
