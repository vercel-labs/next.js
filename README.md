# Repro: `%40` does not escape `@` in App Router routes (vercel/next.js#52391)

`app/%40test/page.tsx` should be reachable at `/@test`, but only `/%40test` works.

## Run

```bash
npm install
npm run dev
curl -i --path-as-is http://localhost:3000/@test    # 404
curl -i --path-as-is http://localhost:3000/%40test  # 200
```

Same result with `npm run build && npm start` (build output lists the route as `/%40test`).

Verified on next@16.3.1-canary.25.
