# Repro: Turbopack `next build` emits server source maps by default (vercel/next.js#96748)

```bash
npm install
./compare.sh
```

Observed with next@16.3.0 and next@16.3.1-canary.3 (Node 24, linux x64), 44 app routes:

| build | `.map` files under `.next/server` | unique maps (md5) | `.next/server` |
|---|---|---|---|
| `next build` (Turbopack, default) | 149 | 61 | 6.2 MB |
| `next build` with `experimental.serverSourceMaps: false` | 0 | – | 2.7 MB |
| `next build --webpack` (default) | 0 | – | 1.6 MB |

Notes:
- Defaults differ between bundlers: webpack honors the `serverSourceMaps` default of `false`,
  Turbopack emits server maps unless the flag is explicitly set to `false`.
- Explicitly setting `experimental.serverSourceMaps: false` *is* honored by Turbopack here
  (the flag reaches the Rust side through the serialized `NextConfig`, even though no JS in
  `dist/build/turbopack*` references it). `'experimental.serverSourceMaps'` remains commented
  out in `unsupportedTurbopackNextConfigOptions`, so nothing is printed either way.
- Duplicate maps exist (per-route `app/*/page.js.map` and `_next-internal_..._actions_*.js.map`
  are byte-identical across all routes: 45 copies each here), but they are small: duplicated
  bytes are only ~0.1% of the 2.93 MB of map bytes in this synthetic app, not the 88.9%
  reported for the private monorepo.
