# Repro: next.js#51648 — intercepted route modal opens on the full page when search params change

Minimal App Router repro of https://github.com/vercel/next.js/issues/51648

## Run
```
npm install
npm run dev   # or: npm run build && npm start
```

## Steps
1. Open http://localhost:3000 and click "Search" -> intercepted `/search` renders in the `@modal` slot (expected).
2. Hard navigate to http://localhost:3000/search?q=food -> full `/search` page renders, no modal (expected).
3. Type in the input on the full page (calls `router.replace('/search?q=...')`).

## Actual
The URL updates and the full page updates, but the intercepted route (`app/@modal/(.)search/page.js`) is *also* rendered on top, so the modal appears while already on the full page.

## Expected
Changing only search params of the current route should not trigger route interception.

`node test.mjs` automates the steps with Playwright (requires the dev/prod server on port 3000).
