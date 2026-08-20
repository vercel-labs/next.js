# Repro: issue #63749 — `Prop nonce did not match` hydration warning (App Router + middleware CSP nonce)

Minimal reproduction of https://github.com/vercel/next.js/issues/63749

- `middleware.js` generates a per-request CSP nonce and forwards it as the `x-nonce` request header.
- `app/layout.js` reads `headers().get('x-nonce')` and renders an inline `<script nonce={nonce}>` in `<head>`.

## Run

```bash
npm install
npm run dev   # http://localhost:3000
```

Open the browser console.

## Observed (next 14.1.4 + react 18.2.0 / 18.3.1)

```
Warning: Prop `nonce` did not match. Server: "" Client: "<base64 nonce>"
    at script
    at head
    at html
```

The HTML actually contains `nonce="<value>"`, but the browser's CSP "nonce hiding"
clears the *attribute* (`el.getAttribute('nonce') === ''` while `el.nonce` keeps the value),
so React's attribute-based hydration check reports a mismatch.

## Not reproducible on next canary (16.3.1-canary.25 + react 19.2.8)

React 19 no longer diffs the `nonce` attribute during hydration, so no warning is logged
(use `await headers()` in the layout on Next 15+).
