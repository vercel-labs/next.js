# Repro: NextResponse.rewrite() does not override origin headers (vercel/next.js#70515)

Minimal, self-contained reproduction (no external network needed): a local "origin"
server on port 4000 is targeted by an external rewrite from `middleware.ts`, which also
sets `cache-control`, `server`, `x-origin-only` and `custom` on the rewrite response.

## Run

```bash
npm install
npm run repro          # next dev  (exit code 1 = bug present)
npm run build && npm run repro start   # next start
```

## Observed (next@16.3.1-canary.25, dev and start)

```
custom        : from-middleware                  (middleware value kept - origin does not send it)
cache-control : private, no-store, origin-value  (expected "public, max-age=60")
server        : origin-server                    (expected "from-middleware")
x-origin-only : origin-value                     (expected "from-middleware")
```

Any header the proxied origin sends wins over the header set on `NextResponse.rewrite()`;
only headers absent from the origin response survive. `next/dist/server/lib/router-utils/proxy-request.js`
proxies via `httpxy`, which writes the upstream headers straight onto the response.
