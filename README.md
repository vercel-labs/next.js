# Repro for vercel/next.js#69570 — `rewrites()` proxy hangs forever when the upstream body is shorter than its `Content-Length`

The reporter's upstream (FastAPI, `RuntimeError: Response content shorter than Content-Length`)
occasionally sends fewer bytes than the advertised `Content-Length`. `backend.mjs` reproduces
exactly that: it answers `/thumbnail` with `Content-Length: 65536` but writes only 1024 bytes
and ends the response.

## Run

```bash
npm install
node backend.mjs &            # upstream on :4000
npm run dev                   # Next.js on :3000, rewrites /api/* -> :4000
# direct upstream: fails fast with a truncated transfer
curl -o /dev/null -w '%{time_total} %{size_download}\n' http://127.0.0.1:4000/thumbnail
# through the Next.js rewrite: never finishes
curl -o /dev/null -w '%{time_total} %{size_download}\n' --max-time 40 http://127.0.0.1:3000/api/thumbnail
node probe.mjs 20             # 20 concurrent proxied requests + page requests afterwards
node flood.mjs 300            # 300 leaked sockets held open by the proxy
```

## Observed (next 15.5.4, node 24)

- direct to upstream: client errors after ~5s (keep-alive close), curl exit 18, 1024 bytes.
- through the rewrite: the response never ends — 30s/40s/60s client timeouts, always
  `size_download=1024`, no `ECONNRESET`, and *no request log line* from Next.js.
- identical with `next dev`, `next dev --turbopack` and `next build && next start`.
- every hung request holds a client socket + an upstream socket open indefinitely
  (`flood.mjs 300` => 300 stuck requests); the Node server itself keeps answering `/`,
  so the user-visible "freeze" is per-connection/browser connection-pool exhaustion.
- `next@16.3.1-canary.25`: the proxied request *does* terminate (~6s, truncated transfer,
  curl exit 18) — the infinite hang is not reproducible on that canary.
