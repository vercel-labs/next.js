# Repro: vercel/next.js#70164

Search params do not invalidate a cached `notFound()` RSC response during client-side navigation.

## Run
```
npm install
npm run dev   # http://localhost:3000/client?year=2024
```

`/client` renders `notFound()` unless `?year=2025`.

Steps: load `/client?year=2024` (not-found, expected) -> click "2025" link.
The page still shows "Year not found" even though the server logs
`[server] rendering /client with year = 2025` and returns 200.
A hard reload on `?year=2025` renders correctly; navigating to 2024 and back
to 2025 shows not-found again.

Reproduced with next 16.3.1 and 16.3.1-canary.25, `next dev` and `next start`.
