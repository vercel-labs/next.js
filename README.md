# Repro: Turbopack does not pass comments to SWC Wasm plugins (vercel/next.js#86844)

`plugin/comment_probe.wasm` is a ~40-line SWC Wasm plugin (source in `plugin-src/`, built
against `swc_core 45.0.1`, the version used by Next.js 16.0.7). It counts the leading
comments of every top-level module item via `PluginCommentsProxy::get_leading` and replaces
the string literal `"COMMENT_PROBE"` with `comments=<n> marker=FOUND|MISSING`
(`FOUND` when a comment containing `@marker` was visible to the plugin).

`app/page.tsx` (server component) and `app/ClientComp.tsx` (`"use client"`) both have a
`/** @marker */` JSDoc comment above the component and render `"COMMENT_PROBE"`.

## Run

```bash
npm install
npm run dev          # Turbopack (default in Next 16)
curl -s http://localhost:3000/ | grep -o 'comments=[0-9]* marker=[A-Z]*'
# => comments=0 marker=MISSING   (comments are not passed to the plugin)

npm run dev:webpack  # webpack
curl -s http://localhost:3001/ | grep -o 'comments=[0-9]* marker=[A-Z]*'
# => comments=1 marker=FOUND
```

## Observed

| bundler | server component | client component |
| --- | --- | --- |
| Turbopack (`next dev`, Next 16 default) | `comments=0 marker=MISSING` | `comments=0 marker=MISSING` |
| webpack (`next dev --webpack`) | `comments=1 marker=FOUND` | `comments=1 marker=FOUND` |

Turbopack `next build` output chunks also contain `comments=0 marker=MISSING`.

Same Turbopack result on Next 15.5.7 (`next dev --turbopack`) and 16.3.1-canary.26, so the
user-visible regression in 16 comes from Turbopack becoming the default bundler: the wasm
plugin runs, but the comment map it receives is empty.

## Rebuild the plugin (optional)

```bash
cd plugin-src
rustup target add wasm32-wasip1
cargo build --release --target wasm32-wasip1
cp target/wasm32-wasip1/release/comment_probe.wasm ../plugin/comment_probe.wasm
```
