# Reproduction: terminal `/500` App lookup is overwritten by the Pages fallback

Issue: https://github.com/vercel/next.js/issues/97843 (verified on `next@16.3.2`, same code on `canary`).

`BaseServer.renderErrorToResponseImpl()` (`packages/next/src/server/base-server.ts`, canary L3263-3288):

* looks up `/500` with `isAppPath: true` using the raw pathname (`/500`), never `getOriginalAppPaths('/500')` -> `/500/page`, so `app/500/page.tsx` can never be found;
* then assigns the Pages `/500` lookup **unconditionally**, despite the comment "If the above App Router result is empty, fallback to pages router 500 page". The nearby 404 branch guards its fallback with `if (!result && ...)`.

## Run

```bash
npm install
npm run build

# A) stock behavior: App /500 lookup misses the /500/page bundle key
node server.js
curl -i http://localhost:3101/throws     # 500, "Internal Server Error", no APP_500_MARKER
curl -s http://localhost:3101/__calls    # observed findPageComponents calls

# B) emulate only the missing bundle-key mapping (getOriginalAppPaths):
FIX_APP_LOOKUP=1 node server.js
curl -i http://localhost:3101/throws     # still no APP_500_MARKER
curl -s http://localhost:3101/__calls

# for contrast, a direct request renders the app page:
npx next start -p 3100
curl -s http://localhost:3100/500 | grep APP_500_MARKER
```

`server.js` is a custom server that wraps `NextNodeServer.prototype.findPageComponents` to log
every `/500` and `/_error` lookup performed by the terminal error path. `pages/throws.js` throws in
`getServerSideProps` to reach `renderErrorToResponse` (an App Router throw is absorbed by App
Router error recovery and never reaches this branch).

## Observed

Build manifests: `.next/server/app-paths-manifest.json` has `"/500/page"`, `.next/server/pages-manifest.json` has `"/500": "pages/500.html"`.

A) stock:
```json
[{"requestedPage":"/500","lookedUpPage":"/500","isAppPath":true,"result":null},
 {"requestedPage":"/500","lookedUpPage":"/500","isAppPath":false,"result":null},
 {"requestedPage":"/_error","lookedUpPage":"/_error","isAppPath":false,"result":"/_error"}]
```

B) with the App bundle key fixed (`FIX_APP_LOOKUP=1`) the App result is non-null yet is still
discarded by the unconditional Pages assignment:
```json
[{"requestedPage":"/500","lookedUpPage":"/500/page","isAppPath":true,"result":"/500/page"},
 {"requestedPage":"/500","lookedUpPage":"/500","isAppPath":false,"result":null},
 {"requestedPage":"/_error","lookedUpPage":"/_error","isAppPath":false,"result":"/_error"}]
```
Response body: `Internal Server Error` (from `/_error`), never `APP_500_MARKER`.
