# next#66115 — "Buffer polyfill not work on ios lower then 14"

Reproduction attempt for https://github.com/vercel/next.js/issues/66115
(the reporter's CodeSandbox devbox is not publicly accessible — HTTP 403).

The report says the `Buffer` polyfill Next.js injects into client bundles throws
`SyntaxError: No identifiers allowed directly after numeric literal` on iOS/Safari
< 14 (the message JavaScriptCore emits for BigInt literals such as `32n`,
see feross/buffer#359).

## What this repo checks

- `app/page.js` — client component that touches the global `Buffer`, so webpack's
  `ProvidePlugin` injects `next/dist/compiled/buffer`.
- `app/bigint-dep/page.js` + `lib/bigint-dep.js` — control case: a module that
  really does ship BigInt literals to the client.
- `audit.js` — feeds every emitted client chunk to `esbuild` with
  `target: safari12 / safari13 / ios12 / ios13`; esbuild fails on syntax the
  target cannot parse.
- `check.js` — parses every client chunk with `acorn` at `ecmaVersion: 2019`
  (the Safari 12/13 language level, no BigInt) and greps for BigInt literals.

## Run

```bash
npm install
npm run audit
```

## Result (next@14.2.3, also re-checked on next@16.3.1-canary.25 / Turbopack)

```
target=safari12: 1/13 chunks unsupported
   .next/static/chunks/app/bigint-dep/page-*.js :: Big integer literals are not
   available in the configured target environment ("safari12")
target=safari13: 1/13 ... (same single chunk)
target=ios12:    1/13 ... (same single chunk)
target=ios13:    1/13 ... (same single chunk)

scanned 13 client chunks, 0 fail to parse at ES2019 (Safari <14) level
```

Only the synthetic `/bigint-dep` chunk is unparseable on iOS < 14. The chunk that
contains the injected Buffer polyfill (`app/page-*.js`, it holds
`Invalid string. Length must be a multiple of 4` from base64-js) passes every
old-Safari target, and the whole vendored polyfill
(`next/dist/compiled/buffer`, buffer 5.6.0) parses as ES2019 and contains no
`BigInt` token at all:

```bash
grep -c BigInt node_modules/next/dist/compiled/buffer/index.js   # 0
```

Even when the app has npm `buffer@6.0.3` in `node_modules` (webpack then resolves
the `ProvidePlugin` request to that copy instead of the vendored one), the emitted
chunk only contains `BigInt(32)`-style *calls* behind buffer's
`defineBigIntMethod` guard — no BigInt *literals* — and still passes
`target=ios12`.

So the parse-time `SyntaxError` reported in the issue does not come from the
Next.js Buffer polyfill in 14.2.3 or in current canary; it comes from some other
module in the same chunk that ships BigInt literals (what `/bigint-dep`
demonstrates). Next.js/SWC does not downlevel or warn about BigInt literals in
dependencies even though the default browserslist target includes Safari 12.
