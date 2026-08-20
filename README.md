# Repro: Next.js requires `compiler.relay.src`, blocking Relay multi-project config (vercel/next.js#73097)

Relay's multi-project config format (`relay.config.js` with `sources` + `projects`) has no single
source root, so there is nothing meaningful to pass as `compiler.relay.src` in `next.config.mjs`.
Next.js' config schema still requires it.

## Run

```bash
npm install
npx next dev      # or: npx next build
```

## Observed (Next.js 16.3.1)

```
⚠ Invalid next.config.mjs options detected:
⚠     "compiler.relay.src" is missing, expected string
FATAL: An unexpected Turbopack error occurred.
Error [TurbopackInternalError]: failed to parse next.config.js
Caused by:
- compiler.relay: missing field `src`
```

`next dev` never serves a request and `next build` exits 1 with the same Turbopack config parse
error, so with Turbopack the missing `src` is fatal, not just a warning.

## Control

Adding `src: '.'` to `compiler.relay` makes dev boot and the transform apply: `/` renders
`RELAY_TRANSFORM_APPLIED` from `__generated__/pageQuery.graphql.ts`. That proves `src` is only a
schema requirement — `RelayTransformer::new` in
`turbopack/crates/turbopack-ecmascript-plugins/src/transform/relay.rs` reads only
`artifact_directory` and `language` and never uses `src`.
