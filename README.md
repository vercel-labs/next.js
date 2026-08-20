# Repro: next.js#29362 — webpack production build cannot find the emitted server `.wasm` chunk

Minimal reproduction of https://github.com/vercel/next.js/issues/29362 on **Next.js 16.3.1**.

`wasm/add.wasm` is a 41-byte hand-written WebAssembly module exporting `add(i32, i32) -> i32`.
It is imported statically from a page (`getServerSideProps`) and from an API route, with
`experiments.asyncWebAssembly` + `layers` enabled in the webpack config.

## Run

```sh
npm install
npx next build --webpack
```

Observed:

```
✓ Compiled successfully
  Collecting page data ...
[Error: ENOENT: no such file or directory, open '.next/server/static/wasm/552fdb8eb3e93f00.wasm']
> Build error occurred
Error: Failed to collect page data for /
```

The asset was actually emitted one directory deeper:

```
$ find .next -iname '*.wasm'
.next/server/chunks/static/wasm/552fdb8eb3e93f00.wasm
.next/server/chunks/static/wasm/6c0a340e02737003.wasm
```

## What works

* `npx next dev --webpack` → `GET /api/add` returns `{"sum":5}`
* Turbopack: replace next.config.js with `module.exports = { turbopack: {} }`, then
  `npx next build --turbopack && npx next start` → `{"sum":5}`
  (wasm emitted as `.next/server/chunks/wasm_add_*.wasm`)

So only the **webpack production server build** mis-resolves the wasm chunk path.
