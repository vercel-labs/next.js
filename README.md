# Streamed SSR closing-tag check (next@16.1.1-canary.7)

Minimal App Router app with `export const dynamic = 'force-dynamic'` and a Suspense
boundary awaiting ~300ms, so the HTML streams in multiple flushes.

## Run

```
npm install --legacy-peer-deps
npx next dev --port 3111   # curl -s http://localhost:3111/ | grep -o '</body>' | wc -l
npx next build && npx next start --port 3112
```

## Result

Both dev and production streamed responses contain exactly one `</body>` and one
`</html>`. `curl --trace-time` shows 3 received chunks ~280ms apart, confirming a
real multi-flush stream. No duplicated closing tags observed.
