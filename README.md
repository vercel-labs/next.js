# Reproduction: CSP error when using next/image (vercel/next.js#45184)

next/image always renders an inline `style="color:transparent"` attribute, which is
blocked by a `style-src 'self'` Content-Security-Policy (no `unsafe-inline`).

Reproduced with next@16.3.1-canary.25.

## Run

```bash
npm install
npm run build
npm start          # http://localhost:3000
# automated check:
npx playwright install chromium
npx playwright test
```

## Observed

`curl -s http://localhost:3000/ | grep -o '<img[^>]*>'` contains `style="color:transparent"`,
and the browser console logs:

```
Applying inline style violates the following Content Security Policy directive
'style-src 'self''. ... The action has been blocked.
```
