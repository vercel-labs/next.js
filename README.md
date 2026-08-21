# Reproduction harness for vercel/next.js#87071

"Next.js 16: rewrite/proxy no longer works in production (500), but works in dev"

The reporter's linked project (TheDanniCraft/clipify) needs a database, Sentry and a
Coolify/Traefik deployment, so this is a minimal standalone harness that recreates every
ingredient named in the issue and in PR #87244 / #87597:

* `output: 'standalone'` + `next build --webpack` + `node .next/standalone/server.js`
* external rewrites to the reporter's real upstream
  (`https://analytics.thedannicraft.de//js/script.file-downloads.hash.outbound-links.tagged-events.js`,
  including the double slash) and to `https://plausible.io/js/script.js`
* `proxy.ts` (Next 16 middleware) doing `NextResponse.rewrite()` to external URLs
* a local upstream (`upstream.js`) that answers with gzip / gzip+chunked / brotli /
  plain / wrong content-length / `Connection: close` / redirect bodies
* an optional Traefik reverse proxy in front (`traefik/`), with the `compress`
  middleware, plaintext HTTP/1.1 on :8080 and TLS + HTTP/2 on :8443

## Run

```bash
npm install
node upstream.js &                     # local upstream fixture on :4000
npm run build                          # next build --webpack (output: standalone)
cp -r .next/static .next/standalone/.next/static
PORT=3002 node .next/standalone/server.js &
BASE=http://127.0.0.1:3002 bash probe.sh          # direct
# optional: Traefik in front (v3.3.4 binary)
traefik --configFile=./traefik/traefik.yml &
BASE=http://127.0.0.1:8080 bash probe.sh          # via reverse proxy, HTTP/1.1
BASE=https://127.0.0.1:8443 bash probe.sh         # via reverse proxy, TLS + HTTP/2
```

## Result observed here

Every combination returns HTTP 200 with a single, correctly decodable
`content-encoding` (gzip / br / zstd pass-through, and Next compresses plain upstream
bodies itself). No 500 was produced with next 16.0.8, 16.1.6 or 16.3.1-canary.26,
neither directly nor behind Traefik with compression, TLS and HTTP/2, and not under
keep-alive or 10-way concurrency.

The only way a 500 appeared was an unrelated misconfiguration: pointing Traefik at the
Next server with `h2c://` (prior-knowledge HTTP/2 to a Node HTTP/1.1 server), which
makes *every* route 500, including plain pages - so it is not rewrite-specific.
