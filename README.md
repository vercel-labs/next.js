# Repro: next.js#53112 — "Optional route parameters are not yet supported"

App Router optional segment directory `app/[[lang]]/page.js`.

```
npm install
npx next dev   # crashes: Error: Optional route parameters are not yet supported ("[[lang]]").
npx next build # Error: Optional route parameters are not yet supported ("[[lang]]") in route "/[[lang]]".
```

Reproduced on next@16.3.1-canary.25 (Node 24). The dev server process exits, so no route can be served.
