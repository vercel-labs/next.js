# next.js#71630 — Next.js fails to load native node addons (.node) from a local pnpm workspace package

Mirror of https://github.com/daanboer/next-load-native-module (commit a9e8d77c88faf36a65911cb624b56e39de5a2735),
with `allowBuilds` added to `pnpm-workspace.yaml` so `pnpm install` succeeds on pnpm 11.

## Run

Requires a Rust toolchain (`rustup`) and a C linker.

```bash
pnpm install
pnpm -C packages/rust-lib build       # produces packages/rust-lib/dist/index.node (napi-rs)
pnpm -C packages/web-app build        # fails
```

`packages/web-app/next.config.ts` already sets `serverExternalPackages: ["rust-lib"]`, which has no effect.

## Observed (Next.js 16.0.0)

* Turbopack build (`next build`): prerender of `/` fails with `TypeError: (void 0) is not a function` — the
  `greet` export of the native addon is undefined at runtime.
* Webpack build (`next build --webpack`): `../rust-lib/dist/index.node  Module parse failed: Unexpected character '\0' (1:0)`.
* Next.js `16.3.1-canary.24` (Turbopack): `Error: non-ecmascript placeable asset ... (node addon) has no ECMAScript exports, so the export "greet" can't be read from it.`

Sanity check that the addon itself is fine:

```bash
node -e "console.log(require('./packages/rust-lib/dist/index.node').greet('World'))"  # Hello, World!
```
