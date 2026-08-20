# Reproduction for vercel/next.js#62507 — e2e testing middleware geolocation

Two minimal apps showing what is and is not mockable.

## `next14-request-geo` (Next 14.2.5) — the reported problem

```bash
cd next14-request-geo && npm install && npm run dev
curl -s localhost:3000/geo
curl -s localhost:3000/geo -H 'x-vercel-ip-country: IT' -H 'x-vercel-ip-city: Rome'
```

Both requests return `"geo":{}`. `NextRequest#geo` is filled from the
`RequestInit.geo` value supplied by the Vercel runtime, not from request headers,
so it cannot be faked from a test client (Playwright `geolocation` is a browser
Geolocation API option and is unrelated).

## `next15-vercel-functions-geolocation` (Next 15.4.6) — the testable approach

`request.geo` / `request.ip` were removed in Next 15; use
`geolocation(request)` / `ipAddress(request)` from `@vercel/functions`, which
read `x-vercel-ip-*` headers and therefore *are* mockable in e2e tests.

```bash
cd next15-vercel-functions-geolocation && npm install && npx playwright install chromium
npx playwright test          # passes: mocked country IT / city Rome
npm run dev                  # then: curl -s localhost:3001/geo -H 'x-vercel-ip-country: IT'
```

Output without headers: `{"geolocation":{"region":"dev1"},"ip":null}`
With headers: `{"geolocation":{"city":"Rome","country":"IT","flag":"🇮🇹","region":"dev1","latitude":"41.890221","longitude":"12.492348"},"ip":"1.2.3.4"}`
