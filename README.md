# Repro: nonce stripped from React 19 hoisted `<style>` tags during SSR (next.js#76317)

Next.js 16.3.1 / react-dom 19.2.8.

```bash
npm install
npm run build && npm start
curl -s http://localhost:3000 | grep -o '<style[^>]*>'
curl -s http://localhost:3000 | grep -o '<link rel="stylesheet"[^>]*>'
curl -s http://localhost:3000/csp | grep -o '<style[^>]*>'   # nonce comes from middleware CSP
```

Observed: `<style data-precedence="bar" data-href="foo">` — no `nonce`.
`<link rel="stylesheet" ... nonce="12345">` and `<script ... nonce="12345">` keep it.
Same in `next dev`. On `/csp` the middleware CSP nonce is applied to Next's scripts but not to
the hoisted `<style>` tag, so the inline style is blocked under a strict `style-src 'nonce-...'` policy.
