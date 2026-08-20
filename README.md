# Repro: next#71515 — custom server is not bundleable (standalone / esbuild / bun)

    npm install
    npm run repro

## Observed

1. `next build` with `output: "standalone"` succeeds, but `.next/standalone/server.js`
   is Next.js' own generated server. The project's `server.js` (custom HTTP server)
   is never bundled or referenced (`grep "Ready on http" .next/standalone/server.js` => 0 hits).
2. `esbuild server.js --bundle --platform=node` exits 1 with ~30 `Could not resolve`
   errors coming from inside `node_modules/next/dist`, e.g. `critters`, `webpack/lib/*`,
   `react-server-dom-webpack/{client,server,static,server.node}`.
   On next@14.2.15 the same command fails with `react-dom/server.edge`,
   `react-server-dom-turbopack/client.edge`, `critters`, etc.

Reproduced with Node 24 on next@16.3.1 and next@14.2.15 (issue reporter's version).
