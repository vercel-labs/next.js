# Repro: docs CSP `matcher` with `missing: purpose=prefetch` drops CSP on Chrome-preloaded documents

Issue: https://github.com/vercel/next.js/issues/84249
Docs page: https://nextjs.org/docs/app/guides/content-security-policy

`proxy.js` is copied verbatim from the docs page (nonce CSP + the recommended
`matcher` with `missing: [{header next-router-prefetch}, {header purpose=prefetch}]`).

Chrome sends `Purpose: prefetch` (and `Sec-Purpose: prefetch` / `prefetch;prerender`)
on full *document* preloads/prerenders. Those requests skip the proxy/middleware, so
the HTML document that Chrome later commits for the navigation has **no
`Content-Security-Policy` header and no nonce on Next.js scripts**.

## Run

```bash
npm install
npm run build
npm start &          # server on :3000
npm run verify       # curl-style header check for 4 request variants
```

## Expected vs actual

Expected: every HTML document response carries the CSP header with a nonce.
Actual (Next.js 16.3.1): only the plain navigation gets it; the 3 Chrome
preload/prefetch/prerender variants get a full 200 HTML document with no CSP.
