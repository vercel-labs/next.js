# Repro harness for vercel/next.js#97293

`use()` on a server-streamed promise prop that resolves late with a large payload.

Reporter's app is private, so this is a synthetic minimal harness matching the described
pattern: Server Component creates `Promise.race([work, timeout]).then(v => ({id, key, response: v}))`,
passes it unawaited to a Client Component that `use()`s it inside `<Suspense>`.

## Run

```bash
npm install
# dev (Turbopack)
RECORD_COUNT=700 DELAY_MS=2500 npm run dev
# production
npm run build && RECORD_COUNT=700 DELAY_MS=2500 npm start
# then open http://localhost:3000/ and http://localhost:3000/multi
# automated check (prints fallback/resolved/hydrated timeline):
node check5.mjs http://localhost:3000/ 25000 /tmp/shot.png
```

Env knobs: `RECORD_COUNT` (records, ~1.9KB each), `DELAY_MS` (how late the promise settles).
`/multi` streams three promises (500ms, 1200ms, late+large) like the reporter's three promise refs.

## Result on Next.js 16.3.0 / react 19.2.8 / Node 24 / Linux

Every configuration resolved the boundary; the fallback was never permanent:

| Config | payload | delay | outcome |
|---|---|---|---|
| dev (Turbopack), first + repeat loads | 1.3MB | 3s | resolved ~3.3s |
| dev (Turbopack) | ~7MB (4000 rec) | 4s | resolved ~4.8s |
| build + start | 1.3MB | 2s / 6s | resolved right after settle |
| build + start, `/multi`, 800kbps + 4x CPU throttle | 1.3MB | 2.5s | all 3 resolved |
| build + start, `experimental.cacheComponents` (PPR) | 1.3MB | 2.5s | resolved ~2.7s |

In each case hydration completed (~0.2-1.8s) well before the fulfillment row arrived,
i.e. the hydration-vs-late-fulfillment race described in the issue was exercised.
