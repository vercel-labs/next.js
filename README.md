# Repro: vercel/next.js#92935

`next build` crashes under Yarn PnP on Node >= 24.15:
`TypeError: Cannot read properties of undefined (reading '.js')` in
`next/dist/build/next-config-ts/require-hook.js:35` (`require.extensions['.js']`).

## Run

```sh
node -v          # must be >= 24.15.0 (verified on v24.17.0)
corepack enable  # uses yarn@4.14.1 from package.json packageManager
yarn install     # default nodeLinker (pnp) - do NOT set node-modules
yarn build
```

Expected: build succeeds. Actual: crash (exit 1) before compilation starts.

Adding `nodeLinker: node-modules` to `.yarnrc.yml`, or using Node <= 24.14.1,
avoids the crash - confirming it is PnP + Node >= 24.15 specific.

Upstream Node regression: https://github.com/nodejs/node/issues/62786
