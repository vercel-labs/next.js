# Reproduction for vercel/next.js#53558 — "Could not read source map" / missing `*.js.map`

VS Code's js-debug prints `Could not read source map for file://.../<file>.js: ENOENT ...<file>.js.map`
whenever a file loaded by the debuggee carries a `//# sourceMappingURL=` comment while the referenced
`.map` file is not shipped in the npm package.

`cdp-check.mjs` reproduces that check headlessly: it attaches to the Next.js dev server over the
Chrome DevTools Protocol (exactly like VS Code does), collects every `Debugger.scriptParsed`
event and reports each `file://` script whose `sourceMapURL` does not exist on disk.

## Run

```bash
npm install
npm run dev          # terminal 1 (NODE_OPTIONS=--inspect next dev --webpack -p 3003)
npm run check        # terminal 2 — attach to the child inspector on 127.0.0.1:9230
```

`npm run check` requests `/` and `/og`, waits, then prints the dangling source maps.

## Result on next@16.3.1-canary.25

```
scripts with resolvable maps: 591
scripts with MISSING maps: 1
MISSING SOURCE MAP: file:///.../node_modules/next/dist/compiled/@vercel/og/index.node.js -> index.node.js.map
```

Notes:

- The two files named in the original report (`compiled/@next/react-refresh-utils/dist/runtime.js`
  and `dist/internal/helpers.js`) DO ship `.js.map` files in current canary; they did not in
  13.4.12 (`npm pack next@13.4.12` contains the `.js` files with `sourceMappingURL` comments and
  no `.map` files), so that specific message is fixed.
- Remaining offenders in the published tarball: `dist/compiled/@vercel/og/index.node.js` and
  `dist/compiled/@vercel/og/index.edge.js` (both end with `//# sourceMappingURL=index.*.js.map`
  with no map next to them). `index.node.js` is loaded as soon as a route uses `next/og`, which
  is when the debugger warning appears.
- Client-side (`type: "chrome"`) chunks in webpack dev use inline base64 source maps and all
  Turbopack dev chunks serve their `.map` over HTTP with 200, so the browser side is fine.
