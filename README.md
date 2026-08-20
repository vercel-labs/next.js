# Repro: middleware nonce is missing on statically prerendered pages (issue #72800)

Middleware sets `Content-Security-Policy: ... 'nonce-<x>' 'strict-dynamic'` on both the
forwarded request headers and the response (exactly as the Next.js CSP docs describe).

* `/` – statically prerendered at build time (no dynamic API): the HTML contains **no**
  `nonce` attribute on any `<script>` (bootstrap inline scripts included), yet the response
  still carries the CSP header with the nonce → every script is blocked, React never
  hydrates, the page appears blank/inert. This is what users see on non-Vercel hosts
  (AWS Amplify) and in any local `next build && next start`.
* `/dynamic` – `export const dynamic = 'force-dynamic'`: nonce is injected correctly
  (control case).

## Run

```bash
npm install
npm run build
npm start          # http://localhost:3002
curl -s localhost:3002/         | grep -c 'nonce='   # 0  (bug)
curl -s localhost:3002/dynamic  | grep -c 'nonce='   # 11 (works)
node check.mjs     # Playwright: "hydrated: false" + CSP refusal console errors on /
```

Verified with `next@16.3.1`, Node 24.
