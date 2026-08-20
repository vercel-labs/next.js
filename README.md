# Repro: next#53813 — "Failed to fetch RSC payload. Falling back to browser navigation."

Next.js `canary` (verified on 16.3.1-canary.25), App Router.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000 and click "middleware external redirect"
```

Automated check (Chromium console capture):

```bash
npx playwright install chromium
npx playwright test
```

## Observed

Client-side `<Link>` navigation to a path whose middleware returns
`NextResponse.redirect('https://example.com/')` makes the router issue the RSC
fetch `GET /redirect-external?_rsc=...`, which is redirected cross-origin and
blocked by CORS:

```
Access to fetch at 'https://example.com/' (redirected from 'http://localhost:3000/redirect-external?_rsc=...') ... blocked by CORS policy
Failed to fetch RSC payload for http://localhost:3000/redirect-external. Falling back to browser navigation. TypeError: Failed to fetch
```

The browser-navigation fallback then reaches https://example.com/, so the
redirect works but only after a failed request, an extra round trip and a
console error.

Note: the same external redirect done via `redirect('https://example.com/')`
inside a server component page (`/redirect-page`) navigates without any error,
so the failure is specific to external redirects returned from middleware.
