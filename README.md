# Repro: next.js#74319 — built-in not-found page violates `style-src` CSP (no nonce)

Based on the `examples/with-strict-csp` example (middleware sets
`style-src 'self' 'nonce-<nonce>'`).

## Run

```bash
npm install
npm run build
npm run start          # http://localhost:3000
npx playwright install chromium
npm run check          # loads /adasd, prints CSP console errors
```

## Observed (next@16.3.1-canary.25)

`/adasd` renders the built-in App Router 404 page. Its HTML contains
`<style>body{color:#000;...}</style>` with **no `nonce` attribute**, plus several
inline `style="..."` attributes. Chromium blocks all of them:

```
Applying inline style violates the following Content Security Policy directive
'style-src 'self' 'nonce-...''.
```

`getComputedStyle(document.body).backgroundColor === "rgba(0, 0, 0, 0)"` and
`document.styleSheets.length === 0` → the 404 page is unstyled.

Additionally, on the statically prerendered `/_not-found` route **no nonce is
propagated to the `<script>` tags either** (they are emitted without `nonce`,
while `/` does get `nonce="..."`), so `script-src` blocks hydration chunks too.

## Expected

Framework-owned not-found/error pages should be renderable under a strict
nonce-based CSP without `'unsafe-inline'`.
