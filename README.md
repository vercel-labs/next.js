# Repro harness for vercel/next.js#97299

Claim under test: on Next.js 16.3.0, every server render of a **dynamic** App Router page that
contains **client components** permanently retains that request's RSC flight payload in the Flight
client `_chunks` Map, causing linear heap growth (0.13–0.33 MB/request) and eventual OOM.

## Shape

* `app/layout.jsx` reads `headers()` when `NEXT_PUBLIC_DYNAMIC=1` (all routes become `ƒ`); with the
  variable unset the identical code prerenders every route (`○`) — the reporter's one-variable control.
* `middleware.js` is Next's own CSP-nonce middleware from the docs (per-request nonce, CSP on both the
  request and the response), i.e. the exact pattern the issue blames.
* Routes: `/client-heavy` (~1 MB flight payload passed to a client component + JSON-LD),
  `/streamed` (Suspense + async server component + client component), `/kitchen`
  (server action, `after()`, `next/image`, `generateMetadata`, two client components),
  `/server-only` (~2 MB HTML, no client components — control), `/`.
* `output: 'standalone'`, server started **directly** with `--expose-gc`, exactly as the issue asks.
* `probe.cjs` exposes an HTTP endpoint that runs `global.gc()` twice and returns `heapUsed`, so every
  sample is live/reachable heap only.

## Run

```bash
npm install
NEXT_PUBLIC_DYNAMIC=1 npm run build      # dynamic (ƒ) build; omit the env var for the static (○) build
./run.sh dyn 3000 3999 sweep.mjs         # per-route heapUsed growth over 300 requests
./run.sh dyn 3000 3999 trend.mjs /client-heavy 8 500 4   # 4000 requests, heap printed every 500
```

## Result on Next.js 16.3.0 (node 24.17 and node 22.21, linux x64)

`heapUsed` after two forced GCs, 300 requests per route:

| route | dynamic (ƒ) MB/req | static (○) MB/req |
| --- | --- | --- |
| `/` | 0.0059 | 0.0036 |
| `/client-heavy` | -0.0076 | -0.0092 |
| `/streamed` | 0.0007 | 0.0002 |
| `/kitchen` | 0.0004 | 0.0002 |
| `/server-only` | 0.0002 | 0.0000 |

4000 sequential/concurrent requests to `/client-heavy` (≈1 MB flight payload each) keep heapUsed flat
at 30–31 MB (node 22: 28.2 → 30.3 MB over 3000 requests, ≈0.0002 MB/req, i.e. <0.03 % of the payload).

So the dynamic vs. static ratio here is ~1×, not the 43–191× reported. The described shape alone
(dynamic rendering + client components + CSP nonce) does not leak; the retainer chain reported in the
issue needs an additional ingredient from the reporter's app to be reproduced.
