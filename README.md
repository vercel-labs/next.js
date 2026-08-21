# Repro: search (query) params bypass the client-side Router Cache (#80042)

Two identical dynamic routes with `loading.jsx`. `/no-param` is navigated without a
search param, `/yes-param?foo=bar` with one. `experimental.staleTimes.dynamic = 30`.

## Run

```bash
npm install
npm run build && npm start   # or: npm run dev
```

Then click "No search param" / "Yes search param" (returning Home between clicks).

Automated check (needs `npx playwright install chromium`):

```bash
node test.mjs   # BASE=http://localhost:3000
```

## Result on next@15.4.0-canary.61 (and 15.5.23)

```
{"no-param":[true,false,false],"yes-param":[true,true,true]}   // true = loading.jsx shown
```

`/no-param` is served from the Router Cache on repeat navigations (no `_rsc` request,
identical rendered timestamp). `/yes-param?foo=bar` re-fetches every time and flashes
`loading.jsx`, even though it is within the 30s stale time.

## Result on next@16.3.1-canary.26

```
{"no-param":[false,false,false],"yes-param":[true,false,false]}
```

Both routes are cached — the search-param route is only fetched once.
