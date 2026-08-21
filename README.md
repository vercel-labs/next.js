# Repro: Next.js #75496 — router cache not reused for links with query params

App Router client-side router cache (`experimental.staleTimes.dynamic: 30`) is ignored when
navigating a second time to a URL that has search params, while the same route without search
params is served from cache.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start &            # next start on :3000
npm run repro          # playwright script, prints RSC request counts
```

## Expected vs actual (Next 15.5.4, `next start`)

```
with-query-param:    secondNavRscRequests=1  secondNavMs=~1300  refetched=true   <-- bug
without-query-param: secondNavRscRequests=0  secondNavMs=~50    refetched=false
```

The second click on `/link2?q=1` (well inside the 30s dynamic stale time, after navigating back to
`/link1`) issues a new `GET /link2?q=1&_rsc=...` and re-renders the 1s-delayed page, showing
`loading.tsx` again. The identical flow through `/link2` (no search params) is instant with zero
RSC requests.

Confirmed present on 15.1.0 and 15.5.4; not reproducible on 16.3.1.
