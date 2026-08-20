# Repro: App Router nonce missing on statically prerendered pages (vercel/next.js#63015)

The original reproduction linked in the issue (`moloch--/nextjs-broken-csp`) is gone (404),
so this is a minimal rebuild.

`middleware.js` follows the documented CSP recipe: it generates a per-request nonce, sets
`Content-Security-Policy: ... script-src 'self' 'nonce-<n>' 'strict-dynamic'` on both the
request and the response.

## Run

```bash
npm install
npm run build
npm run start        # http://localhost:3000
npm run verify       # in another shell
```

## Observed

- `/` (prerendered, `○ Static`): CSP response header contains a nonce, but **no `<script>` tag
  carries a `nonce` attribute** -> every framework chunk and inline bootstrap script is blocked,
  the page never hydrates. Chromium: "Loading the script ... violates the following Content
  Security Policy directive" / "Executing inline script violates ...".
- `/dynamic` (`export const dynamic = 'force-dynamic'`): all scripts carry the nonce, no
  violations, and `'unsafe-eval'` is **not** required.
- `next dev` renders nonces on the same static page, so the failure is production-build only.

Verified with next@15.5.4 and next@14.1.1 (the version in the issue).
