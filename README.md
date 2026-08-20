# Repro: ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING loading next.config.js (vercel/next.js#34685)

Next.js loads `next.config.js` with a dynamic `await import()`
(`next/dist/server/config.js`). When the custom server is loaded by a CJS loader
that compiles modules with `vm.Script` without an `importModuleDynamically`
callback (this is what `node -r esm` / `esm@3.2.25` does), that dynamic import
throws.

`esm@3.2.25` (2019) can no longer parse modern Next.js output, so this repro
replaces it with `vm-loader.js`: a ~20 line `require.extensions['.js']` hook that
reproduces the same condition.

## Run

```bash
npm install
npm run dev   # node -r ./vm-loader.js server.js
```

## Actual (next@canary 16.3.1-canary.25, Node 20.18.1)

```
⨯ Failed to load next.config.js, see more info here https://nextjs.org/docs/messages/next-config-error
TypeError: A dynamic import callback was not specified.
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING'
```

The original report (Next 12.1.1-canary.1 + Node 16 + `node -r esm server.js`)
fails with the same `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` code inside
`loadConfig`.

## Expected

Next.js falls back to `require()` for a CJS `next.config.js`, or surfaces an
actionable error instead of crashing the server.
