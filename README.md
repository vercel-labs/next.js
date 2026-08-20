# Repro: `response.body?.cancel()` hangs forever in App Router (vercel/next.js#72389)

```bash
npm install
npm run build && npm run start
# in another shell:
curl -m 30 -sS -o /dev/null -w '%{http_code}\n' http://localhost:3000/
```

Observed: the request never responds (curl times out). Server logs print
`[repro] fetched, status 200 cancelling body` but never `[repro] cancelled`,
so the promise returned by `response.body.cancel()` never resolves.
`Ctrl+C` (SIGINT) afterwards no longer terminates `next start`.

Confirmed with next@15.0.2 (pinned here) and next@16.3.1 on Node 24.
The same code in plain Node (`fetch` without Next's patched fetch) resolves
`cancel()` immediately, so the hang comes from Next's fetch patch/cache layer.
