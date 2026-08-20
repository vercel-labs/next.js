# Repro: vercel/next.js#67751 — `unstable_cache` stale value is persisted into the ISR page cache

Minimal, seconds-long version of the reporter's 24h scenario. `revalidate: 5` is used so the
one-interval lag is observable immediately instead of after a day.

`app/cached/5s/page.tsx` renders `Date.now()` produced inside an `unstable_cache` callback with
`{ revalidate: 5 }`. The page has no `export const revalidate`, so it inherits `Revalidate 5s`
from the cache entry (visible in the build output).

## Run

```bash
npm install
npm run build
npm start           # in one shell
node poll.mjs http://localhost:3000/cached/5s 30   # in another
```

`poll.mjs` prints `staleness` = (now - timestamp rendered in the HTML).

Or run the whole thing for an arbitrary version: `./test-version.sh <next-version> <port>`
(then `node summarize.mjs logs/poll-<version>.txt`, which ignores the first 8s of warm-up).

## Observed with next@15.5.4 (buggy)

Steady state staleness is always **6–10s for a 5s interval**: every ISR revalidation writes the
*previous* cache value, one full interval behind.

```
t=+6.2s  cache=HIT   renderedTs=1787262917420 staleness=6.1s
t=+11.2s cache=HIT   renderedTs=1787262922466 staleness=6.1s
```

Server log shows the callback runs with a fresh timestamp while the render uses the stale one:

```
[unstable_cache cb executed] fresh ts = 1787263441843
[render] rendered with ts = 1787263436799 lag(ms) = 5044
```

With `revalidate: 86400` this is exactly the reported symptom: the page appears never to update.

## Observed with next@15.5.5+, 16.0.0 and 16.3.1 (fixed)

Steady state staleness is 1–5s; `[render]` uses the freshly computed timestamp (`lag(ms) = 3`).

The fix is in `unstable-cache.ts`: when `workStore.isRevalidate`, the stale entry is no longer
returned; the revalidation promise is awaited (foreground/blocking revalidate). Diff between
15.5.4 and 15.5.5 of `dist/server/web/spec-extension/unstable-cache.js` shows exactly this change.

Note: a 5s interval on next@15.0.3 did *not* reproduce (that version recomputes synchronously in
this configuration), so pin 15.5.4 to see the failure.
