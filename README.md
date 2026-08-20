# Repro: next#53438 — URL rewrites break URLs containing multiple slashes

    npm install && npm run dev
    curl -s -i --path-as-is 'http://localhost:3000/image/https://i.imgur.com/V7WhMQt.jpeg'

## Observed (next@canary 16.3.1-canary.25)
- `GET /image/https://i.imgur.com/V7WhMQt.jpeg` -> `308` to `/image/https:/i.imgur.com/V7WhMQt.jpeg`
  (the `//` is collapsed), then `200` with `{"url":"https:/i.imgur.com/V7WhMQt.jpeg"}`.
  The rewritten URL param is corrupted, so the embedded absolute URL cannot be recovered.
- With `next@13.4.12` the same request 308-redirects to `/image/https:/i.imgur.com/V7WhMQt.jpeg`
  and that path 308-redirects to itself forever => the infinite loop originally reported.
