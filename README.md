# next#84232 — HMR websocket stalls when `assetPrefix` is set

Minimal, cross-platform reproduction of https://github.com/vercel/next.js/issues/84232
(the reporter's repo needs Windows + nginx + mkcert; this one needs only Node).

`next dev` binds the HMR websocket endpoint under the **pathname of `assetPrefix`**.
Any upgrade request to a different path (including the plain `/_next/webpack-hmr`)
gets **no HTTP response at all** — the socket is held open, which the browser shows as
a pending / "stalled" websocket, and HMR never applies updates.

Source (next@15.5.4, `dist/server/lib/router-server.js`, upgrade handler):

```js
let hmrPrefix = basePath;
if (assetPrefix) {                                  // assetPrefix overrides basePath
  hmrPrefix = normalizedAssetPrefix(assetPrefix);
  if (URL.canParse(hmrPrefix)) hmrPrefix = new URL(hmrPrefix).pathname.replace(/\/$/, '');
}
const isHMRRequest = req.url.startsWith(ensureLeadingSlash(`${hmrPrefix}/_next/webpack-hmr`));
if (isHMRRequest) { return developmentBundler.hotReloader.onHMR(...); }
// otherwise: falls through, the upgrade is never answered
```

## Install

```bash
npm install
```

## 1. Protocol-level check (no proxy, no browser)

```bash
# A. control, no assetPrefix
npm run dev            # port 3300
node check.mjs "http://127.0.0.1:3300/_next/webpack-hmr?page=/"
#   -> HTTP/1.1 101 Switching Protocols

# B. with assetPrefix = http://localhost:8888/app1/20250924.1
npm run dev:prefix     # port 3300
node check.mjs "http://127.0.0.1:3300/_next/webpack-hmr?page=/"
#   -> STALLED: no response after 8000ms
node check.mjs "http://127.0.0.1:3300/app1/20250924.1/_next/webpack-hmr?page=/"
#   -> HTTP/1.1 101 Switching Protocols
```

Anything that is not exactly `<assetPrefix pathname>/_next/webpack-hmr` (e.g.
`/foo/_next/webpack-hmr`) also hangs forever instead of returning 400/404.

## 2. Browser check through a reverse proxy (the reporter's scenario)

`proxy.mjs` is an upgrade-aware stand-in for the reporter's nginx on port 8888.
`PROXY_MODE=strip` removes the `/app1/<build>` prefix before forwarding, exactly like
the reporter's `location ~ ^(/app1/[0-9\.]*/)(_next/webpack-hmr) { proxy_pass ...$2; }`.

```bash
npm run dev:prefix                 # terminal 1
npm run proxy:strip                # terminal 2
node browser-check.mjs             # terminal 3 (BASE_URL=http://localhost:8888/)
# [strip-mode] websockets seen: [{"url":"ws://localhost:8888/app1/20250924.1/_next/webpack-hmr","frames":0,"closed":false}]
# [strip-mode] HMR update applied: false
```

Control — same app, prefix forwarded untouched:

```bash
npm run proxy:passthrough
node browser-check.mjs
# [passthrough-mode] websockets seen: [{... "frames":4 ...}]
# [passthrough-mode] HMR update applied: true
```

`browser-check.mjs` uses Playwright; pass `CHROME_PATH=/path/to/chrome` if no
Playwright browser is downloaded.

## Notes

- Reproduces with both the webpack bundler and `--turbopack` on next@15.5.4.
- On next@16.3.1 the endpoint is renamed to `/_next/hmr`; the behavior is the same —
  only `<assetPrefix pathname>/_next/hmr` upgrades, every other upgrade path hangs
  with no response.
