# next#58813 — `revalidateTag` breaks a route that uses `generateStaticParams`

Minimal reproduction of https://github.com/vercel/next.js/issues/58813,
re-verified on `next@16.3.1-canary.25`.

## Run

```bash
npm install
npm run repro      # builds, starts, requests /a, revalidates, requests /a again
```

Or manually:

```bash
npm install
npm run time-server &   # local stand-in for the external tagged fetch (:3999)
npm run build
npm start
curl -i localhost:3000/a               # 200
curl -i localhost:3000/api/revalidate  # revalidateTag("current-time")
curl -i localhost:3000/a               # 404  <-- bug
curl -i localhost:3000/                # 200 (no generateStaticParams -> fine)
```

## Observed

After `revalidateTag`, `/a` (a `generateStaticParams` route with
`dynamicParams = false`) returns **HTTP 404** on every subsequent request, and
the server logs `Error: Internal: NoFallbackError`. `/`, which reads the same
tagged fetch but has no static params, keeps returning 200.

Also reproduces on 14.0.4, 14.0.4-canary.11, 14.2.33 and 15.5.7.
Note: on 16.x, calling the new `revalidateTag("current-time", "max")` form
avoids the 404 but then the tagged fetch is never revalidated at all
(the cached value stays stale).
