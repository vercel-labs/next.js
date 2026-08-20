# Repro: issue #45204 — unchanged modules re-evaluated on each page navigation in dev

`shared.js` logs and stores a random `instanceId` at import time. `/a`, `/b`, `/c` all
import it and expose the id via `getServerSideProps`.

## Run

```bash
npm install
# webpack dev (bug):
npx next dev --webpack -p 3001
for p in a b c a b a; do curl -s localhost:3001/$p | grep -o '"id":"[a-z0-9]*","evals":[0-9]*' | head -1; done
# turbopack dev (default, no bug):
npx next dev -p 3000
for p in a b c a b a; do curl -s localhost:3000/$p | grep -o '"id":"[a-z0-9]*","evals":[0-9]*' | head -1; done
```

## Observed (next@16.3.1-canary.25, node 24)

`--webpack`: id changes on each first visit to a new route (3 evaluations of `shared.js`
for 3 routes), then stabilizes on the newest instance for already-compiled routes.

Turbopack (default): `shared.js` evaluated exactly once; the id is stable for all routes.
