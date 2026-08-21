# Repro: vercel/next.js#95528 — proxy/middleware re-invoked on the internally rewritten URL

Trigger (narrowed down from the original report): the server's **listen hostname differs
from the request `Host` header**. `initUrl` in `resolve-routes` is built from
`opts.hostname`/`opts.port`, while the proxy's `request.nextUrl` origin comes from the
`Host` header. When they differ, `getRelativeURL(x-middleware-rewrite, initUrl)` keeps the
rewrite **absolute**, the router server treats it as an external URL and proxies it back
over HTTP to itself, so the proxy runs a **second time** with `/de/beaches`. next-intl
(`localePrefix: 'as-needed'`) then canonicalizes the explicit default locale to a
**307 → `/beaches`** (self-loop) and the absolute `x-middleware-rewrite` leaks to the client.

This is **not standalone-specific**: `next start -H 127.0.0.1` + `curl http://localhost:PORT/beaches`
reproduces identically. Standalone just hits it more often because `server.js` uses
`process.env.HOSTNAME` (set in many shells / container envs) while `next start` defaults to
`0.0.0.0`, which is normalized to `localhost` and therefore matches.

## Steps

```bash
pnpm install && pnpm build
cp -r .next/static .next/standalone/.next/

# PASSES (hostname == Host)
node .next/standalone/server.js
curl -I http://localhost:3000/beaches            # 200, proxy logs once

# FAILS (hostname != Host)
HOSTNAME=127.0.0.1 pnpm repro
curl -I http://localhost:3000/beaches            # 307 location: /beaches, proxy logs twice
```

Or just `./repro.sh`, which runs both cases.

Verified on next 16.2.10 and 16.3.0-canary.78, Node 24 and Node 25.9.0, Linux.
