# Dev-server WebSocket upgrade check (assetPrefix + HMR path)

Next.js 16.3.1 / 16.3.1-canary.26, pages router.

Steps:
1. `npm i`
2. `npx next dev --port 3400` (add `--webpack` to test the webpack bundler; optionally prefix with `ASSET_PREFIX=http://localhost:8888/app1/20250924.1`)
3. `node probe.js "/_next/hmr?page=/"` – sends a raw WebSocket upgrade and prints the status line, or `STALLED (no response in 8s)`.

Observed:
- no assetPrefix: `/_next/hmr` -> 101; legacy `/_next/webpack-hmr` -> STALLED (never any HTTP response).
- assetPrefix `http://localhost:8888/app1/20250924.1`: `/app1/20250924.1/_next/hmr` -> 101; bare `/_next/hmr` -> STALLED; both `webpack-hmr` variants -> STALLED.

Non-matching upgrade requests are never answered (no 404/400), the socket just hangs.
