# Repro: next.js#88662 — relay `eagerEsModules` ignored by Turbopack

`compiler.relay` is configured with `eagerEsModules: true` (see `relay.config.js`).
`queries/pagesQuery.js` uses a `graphql` tagged template; `pages/index.tsx` JSON-stringifies it.

## Run

```bash
npm install
npm run dev        # next dev --turbopack  -> prints { "default": { ... } }  (BUG)
npm run dev:webpack # next dev --webpack   -> prints { "fragment": ... }     (expected)
```

Then open http://localhost:3000 and read the `<pre id="out">` block.

## Result (next@16.3.1-canary.26)

Turbopack:
```json
{ "default": { "fragment": { ... }, "kind": "Request", ... } }
```
Webpack:
```json
{ "fragment": { ... }, "kind": "Request", ... }
```

Turbopack emits `__turbopack_context__.r("[project]/queries/__generated__/pagesQuery.graphql.ts")`
(a require returning the ES module namespace) instead of the default import,
because `turbopack/crates/turbopack-ecmascript-plugins/src/transform/relay.rs`
`RelayConfig` only deserializes `src`, `artifactDirectory` and `language`, and builds
`swc_relay::Config { .., ..Default::default() }`, so `eagerEsModules` (and `output_file_extension`)
from `next.config` never reach the swc_relay transform.
