# Repro: `router.refresh()` fetches the RSC payload (200) but intermittently applies none of it

Reproduction for https://github.com/vercel/next.js/issues/98224 (the reporter had no public repro).

Next.js `16.2.9`, React `19.2.0`, production build (`output: 'standalone'`), Chromium via Playwright.

## Shape of the app (mirrors the report)

- `app/rows/page.tsx` — dynamic App Router page with a sibling `loading.tsx`, renders rows
  fetched with `fetch(..., { cache: 'no-store' })`.
- `app/event-provider.tsx` — client hook in the **shell layout** holding an `EventSource`
  (`app/api/events/route.ts`).
- `app/rows/refresh-consumer.tsx` — client consumer inside the route. On mount it asks the
  server (`app/api/schedule/route.ts`) to mutate a visible row and broadcast an SSE message
  ~1s later; when that message names a visible row it calls `router.refresh()` from a
  `setTimeout` (400 ms trailing coalescing window), i.e. ~1.4s after the navigation.
- Server state lives in `lib/store.ts`; the mutated row status becomes `done-<N>`, so the
  expected new value is unambiguous both in the RSC payload and in the DOM.

## Run

```bash
npm install
npm run build
npx next start -p 3000        # or: node .next/standalone/server.js
npx playwright install chromium
RUNS=24 npx playwright test   # add RETRY=1 to also test a second refresh() 1.5s later
```

Each run: navigate `/` → click to `/rows`, snapshot `main` innerText, wait for the
SSE-triggered `router.refresh()`, wait ~9.5s, snapshot again, and compare against the row
status the server actually holds. Non-prefetch `_rsc=` responses are captured with their
status code and the status tokens their body contains.

## Observed (Next.js 16.2.9, 2-vCPU Linux container)

- 1/24 and 2/24 runs per batch: the refresh RSC request is issued and returns **200 with the
  new data in the body**, yet the whole route's rendered text is byte-identical 9–12s later.

```
run 13: applied=false server:done-36->done-37 refreshRequests=1
        [200 prefetch=false len=4482 statuses=done-37|pending]
        textAfterUnchanged=true
  FAIL run 13: server had done-37; refresh response status=200 payload statuses=done-37|pending ;
       rendered text still "rows payload seq: 36 Alpha — done-36 Beta — pending Gamma — pending"
```

- Two differences from the report:
  - A second `router.refresh()` 1.5s later is **not** deduplicated: with `RETRY=1` a fresh
    non-prefetch `_rsc=` request appeared in 24/24 runs and 0/24 runs ended stale, so an
    application-level retry does recover the lost update on this repro.
  - The drop did not reproduce on `next@16.4.0-canary.15` in the batches run here (0 failures),
    though the baseline rate is only ~4–8%, so that is not conclusive.
