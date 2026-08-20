# Repro: issue #68015 — `history.pushState("", null, url)` throws in App Router

`next@canary` (verified 16.3.1-canary.25).

```
npm install
npm run dev
# open http://localhost:3000 and click the button, or in devtools console:
# window.history.pushState("", null, "/help")
```

Observed: `Uncaught TypeError: Cannot create property '__NA' on string ''`
(`copyNextJsInternalHistoryState` in `packages/next/src/client/components/app-router.tsx`:
`if (data == null) data = {}` does not handle `""`). Same for `replaceState("")`.

Optional automated check (needs playwright installed): `node check.mjs` while dev server runs.
