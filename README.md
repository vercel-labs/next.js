# Repro: vercel/next.js#77531 — `Cache-Control` missing on responses served from a cache entry written by a previous process

`next start` omits the `Cache-Control` response header when it serves an ISR /
full-route-cache entry that was written to `.next/server/app/<path>.{html,rsc,meta}`
by a **previous** server process (`x-nextjs-cache: STALE`). The persisted `.meta`
file only stores `headers` + `status`, so the cache-control/revalidate metadata is
lost across restarts. A CDN in front of the server then caches a response with no
`Cache-Control` and treats it as immutable.

Not specific to `notFound()` / 404: `/ok/[id]` (a plain `200` ISR page) and
`/player/[id]` (calls `notFound()`) behave identically.

## Run

```bash
npm install
bash repro.sh          # PORT=3123 by default
```

The script builds, boots, warms `/ok/4` + `/player/4` (MISS → writes the cache
entries), kills the server, boots a fresh process and re-requests both paths.

## Observed

`next@16.3.1-canary.26` (also reproduced on the reported `next@15.2.4`):

```
### boot 1: first request per path is a MISS and writes .next/server/app/<path>.{html,rsc,meta}
   /ok/4        HTTP/1.1 200 OK        x-nextjs-cache: MISS   Cache-Control: s-maxage=1, stale-while-revalidate=31535999
   /player/4    HTTP/1.1 404 Not Found x-nextjs-cache: MISS   Cache-Control: s-maxage=1, stale-while-revalidate=31535999
### boot 2: fresh process, cache entries already on disk
   /ok/4        HTTP/1.1 200 OK        x-nextjs-cache: STALE  <- no Cache-Control
   /player/4    HTTP/1.1 404 Not Found x-nextjs-cache: STALE  <- no Cache-Control

RESULT: reproduced (#77531)
```

Note: when killing the server manually, make sure the `next-server` child process
really dies (the script uses a process group). If the old process survives and the
new `next start` fails with `EADDRINUSE`, the requests hit the warm old process and
the header is present, which makes the bug look fixed.
