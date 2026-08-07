# Repro: Turbopack panics with `NftJsonAsset: cannot handle filepath '[turbopack-wasm]/node/loadWasm.ts'`

Issue: https://github.com/vercel/next.js/issues/96897

## Run

```bash
pnpm install
pnpm build
```

## Result

`next build` (Turbopack) fails on Next.js 16.3.0 / 16.3.1-canary.4:

```
FATAL: An unexpected Turbopack error occurred.

Error [TurbopackInternalError]: NftJsonAsset: cannot handle filepath
'[turbopack-wasm]/node/loadWasm.ts', it is not under the output_root:
'[output]/' or the project_root: '[project]/'
```

## Notes

- Minimal trigger: an App Router route handler importing `@takumi-rs/image-response`
  (which pulls in `@takumi-rs/wasm`) with that package listed in
  `serverExternalPackages`. `fumadocs-ui` is **not** required.
- `pnpm build:webpack` (`next build --webpack`) succeeds.
- Next.js 16.2.12 with Turbopack succeeds.
