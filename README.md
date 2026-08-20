# Repro: vercel/next.js#50150 — dynamic page stuck on `loading.tsx` with JavaScript disabled

## Run

```bash
npm install
npx playwright install chromium --with-deps
npm run build
npm start &            # next start -p 3100
npm run check          # Playwright: JS disabled vs enabled
```

## Observed (next@16.3.1-canary.25)

```
javaScriptEnabled=false visibleText="Loading..."
javaScriptEnabled=true  visibleText="DYNAMIC CONTENT 2026-..."
```

`curl http://localhost:3100/dynamic` shows the streamed page HTML inside
`<div hidden id="S:0">`, while `<p id="loading">Loading...</p>` is the only
visible markup. Without client JS the Suspense swap never happens, so the
loading UI is shown forever.
