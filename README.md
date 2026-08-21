# Repro: next/dist/compiled/util breaks strict CSP (no 'unsafe-eval') — vercel/next.js#81496

Client-side code that imports Node's `util` gets Next's browser polyfill
`next/dist/compiled/util/util.js`, which contains a bundled (old) copy of
`is-generator-function`:

```js
f = function () { if (!o) return !1; try { return Function("return function*() {}")() } catch (t) {} }()
```

`Function(...)` is blocked by a CSP without `'unsafe-eval'`, producing a
`script-src` / `eval` violation on every page load in production.

## Run

```bash
npm install
npm run build && npm start      # Turbopack (default in Next 16)
# or: npx next build --webpack && npm start
node check.mjs                  # headless Chromium, prints CSP violations
```

`check.mjs` output (Next 16.3.1):

```
CSP header: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
[console:warning] CSP VIOLATION: script-src | eval | source=http://localhost:3000/_next/static/chunks/<hash>.js:1
```

Grep the built client bundle to confirm the source of the eval:

```bash
grep -l 'Function("return function\*() {}")' .next/static/chunks/*.js
```

Notes:
- `'unsafe-inline'` is intentionally allowed for scripts so the app hydrates and
  the only remaining violation is the `eval` from the `util` polyfill.
- The call is inside a `try/catch`, so the page still renders, but the CSP
  violation is reported/logged on every load.
- Installing the npm `util@0.12.5` package instead resolves it to
  `is-generator-function@1.1.2` (no eval); only Next's vendored copy evals.
