# Repro: `useFileSystemPublicRoutes: false` breaks custom server rendering (404)

Issue: https://github.com/vercel/next.js/issues/59854

```
npm install
npm run build
npm start   # custom server on http://localhost:3000
curl -i http://localhost:3000/a
```

Expected: `pages/a.js` renders (200). Actual: generic Next.js 404 for `/`, `/a`, `/b`.

`server.js` explicitly calls `app.render(req, res, '/a')`; `server-handler.js` (port 3001)
uses the recommended `getRequestHandler()` with an adjusted parsed URL. Both 404 while
`useFileSystemPublicRoutes: false` is set; flipping it to `true` returns 200.

Verified: next@13.4.12 -> 200, next@13.4.13 -> 404, next@16.3.1-canary.25 -> 404.
