# Repro: vercel/next.js#78013 — "Cannot add property rel, object is not extensible"

Extending `icons` from parent metadata inside `generateMetadata` crashes metadata rendering.

## Run

```bash
npm install
npm run dev   # open http://localhost:3000/
```

## Observed (next@15.5.7, also 15.3.1 / 15.4.7)

```
⨯ Error [TypeError]: Cannot add property rel, object is not extensible
    at JSON.parse (<anonymous>)
    at ServerInsertMetadata (../../src/client/components/metadata/server-inserted-metadata.tsx:24:27)
```

No `<link rel="icon">` is emitted and the page shows the dev error overlay.
The same happens with `next build && next start`.

## Expected

Parent icons are merged with the child icons, as it does on next@16.0.0+
(`<link rel="icon" href="/parent-icon.png">` + `<link rel="apple-touch-icon" href="/child-apple-icon.png">`).

## Version matrix (verified)

| next | result |
| --- | --- |
| 15.3.1 | ❌ TypeError |
| 15.3.5 | ❌ TypeError |
| 15.4.7 | ❌ TypeError |
| 15.5.7 | ❌ TypeError |
| 16.0.0 | ✅ works |
| 16.3.1-canary.26 | ✅ works |
