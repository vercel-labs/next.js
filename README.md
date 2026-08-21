# Repro: issue #85841 — prefetched dynamic route served stale from Router Cache after a query-param navigation

Automated version of the reporter's repro (https://github.com/Donggggg/nextjs-router-cache-test-app).

`/b` is `export const revalidate = 0` (dynamic, `ƒ` in build output) and prints `rendered at: <ISO timestamp>`.

## Run

```bash
npm install
npx playwright install chromium-headless-shell
npm run build
npm start &            # next start -p 3001
npm run repro          # playwright: logs every RSC request + rendered timestamp
```

## Scenario

Control (`/` → `/b` → back → `/b`) and issue (`/` → `/b` → `router.replace('/b?test=first')` → back → `/b`).

## Result on next@15.5.6 and next@15.5.23

Issue scenario, final `<Link href="/b">` navigation: **no RSC request**, page shows the timestamp
rendered ~5s earlier (the payload from the first visit). Control scenario always refetches.

Setting `experimental.staleTimes.static = 0` (commented out in `next.config.js`) or `prefetch={false}`
makes it refetch, i.e. the prefetched dynamic entry is being kept under the *static* stale time (5 min).

Fixed on next@16.3.1 / 16.3.1-canary.26 (new client router): the final navigation refetches and shows a fresh timestamp.
