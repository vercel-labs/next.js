# Reproduction: vercel/next.js#47085 — middleware `matcher` misses the `basePath` root route

Middleware whose `matcher` uses the documented catch-all pattern
`'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'`
stops running for the root route once `basePath` is configured. Every other
route still runs middleware, so route protection silently breaks for
`/<basePath>` only.

## Run

```bash
npm install
./verify.sh
```

## Expected vs actual (Next.js 16.3.1, App Router, dev and production)

| config | request | middleware runs? |
| --- | --- | --- |
| no `basePath` | `/` | yes |
| no `basePath` | `/about` | yes |
| `basePath: '/withbase'` | `/withbase` | **no (bug)** |
| `basePath: '/withbase'` | `/withbase/about` | yes |

`.next/server/middleware-manifest.json` shows why — the compiled matcher is

```
^\/withbase(?:\/(_next\/data\/[^/]{1,}))?(?:\/((?!api|_next\/static|_next\/image|favicon.ico|sitemap.xml|robots.txt).*))(\.json|\.rsc|\.segments\/.+\.segment\.rsc)?[\/#\?]?$
```

The group after `/withbase` requires a literal `/`, and `/withbase/` is
308-redirected to `/withbase`, which never matches. Adding `{ source: '/' }`
to the matcher array (or a trailing `?`) works around it.

The same behaviour occurs with the new `proxy.ts` file convention in Next.js 16.
