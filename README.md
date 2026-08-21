# Repro: vercel/next.js#84306

Redirecting after enabling draft mode shows stale content when the target route has a
`revalidate` time (its RSC response is served from the browser disk cache).

## Run

```bash
npm install
npm run build && npm start          # next start on :3000
npx playwright install chromium
npm run repro                       # scripted toggle x3, writes ./artifacts/result.txt
```

Manual: open http://localhost:3000 with devtools caching NOT disabled, click "Toggle draft mode"
three times (enable / disable / enable).

## Observed with next@15.5.4

```
0-initial:       status=disabled | cookie=absent | rendered at T0
1-enable:        status=enabled  | cookie=set    | rendered at T1
2-disable:       status=disabled | cookie=absent | rendered at T0
3-enable-again:  status=disabled | cookie=set    | rendered at T0   <-- stale
```

On the third toggle the `__prerender_bypass` cookie is set but the UI still says `disabled`:
the `GET /?_rsc=...` following the action's 303 redirect is served `fromDiskCache: true`
(cached response has `Cache-Control: s-maxage=60, stale-while-revalidate=31535940`), and an
extra redundant navigation request follows the server action.

Expected: draft-mode redirect bypasses the cached RSC payload; no redundant navigation.

## Not reproducible on next@16.3.1-canary.26

The server action response itself carries the new UI (single request, no 303 + cacheable RSC
GET, no redundant navigation), so status is `enabled` on the third toggle.
