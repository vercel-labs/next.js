# Repro: next#36940 — importing an ESM-only package fails in a custom TypeScript server

Minimal reproduction of https://github.com/vercel/next.js/issues/36940
(the reporter's original repo cannot be installed anymore: it depends on
`git+ssh` branch `expose_fetch` of ambanum/OpenTermsArchive, which no longer exists).

`esm-only-lib/` is a local ESM-only package (`"type": "module"` + `exports` map).

## Steps

```bash
npm install
npm run dev:custom   # ts-node custom server -> Error [ERR_REQUIRE_ESM]
npm run dev          # built-in next dev, then: curl localhost:3000/api/hello -> works (200 JSON)
```

## Observed (next@16.3.1-canary.25, node 24.17, ts-node 10.9.2)

* `npm run dev:custom` (tsconfig.server.json, `"module": "commonjs"`):
  `Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: .../esm-only-lib/src/index.js`
  thrown from `ts-node/dist-raw/node-internal-errors.js`, with
  `Module.mod.require (next/src/server/require-hook.ts:85)` in the stack.
* `npm run dev` + `/api/hello`: `{"lib":{"name":"esm-only-lib default export"}}` — same import works
  through Next's own compiler.
* Workaround suggested in the issue thread (`"module"/"moduleResolution": "NodeNext"`,
  see `tsconfig.server.nodenext.json`) now fails at compile time instead:
  `TS1479: The current file is a CommonJS module whose imports will produce 'require' calls`.
