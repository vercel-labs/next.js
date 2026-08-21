# Repro: next.js#81124 — redirect destination with hash containing query params

Redirect `destination` containing a hash with `?` (e.g. `https://www.example.com/#/login?return=something`)
crashes the request with `TypeError: Unexpected MODIFIER at 8, expected END` (path-to-regexp compile).

## Run

```
npm install
npm run dev
curl -sI http://localhost:3000/go-hash-query   # 500 (expected 307)
curl -sI http://localhost:3000/go-hash         # 307 -> https://www.example.com/#/login
curl -sI http://localhost:3000/go-escaped      # 307 (workaround: escape ? as \\?)
```

Reproduced on next@15.4.0-canary.104 (webpack dev) and next@16.3.1-canary.26 (Turbopack dev).
