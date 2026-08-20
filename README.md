# Repro: `ReferenceError: Cannot access 'watcher' before initialization` (vercel/next.js#48818)

A user webpack plugin that throws inside `compiler.hooks.watchRun` makes `next dev`
(webpack mode) crash with a TDZ error from Next's own hot reloader, masking the real
plugin error.

## Run

```bash
npm install
npx next dev --webpack   # Next <15: npx next dev
```

## Observed (Next 16.3.1-canary.25 and 13.4.19)

```
ReferenceError: Cannot access 'watcher' before initialization
```

Source: `next/dist/server/dev/hot-reloader-webpack.js` — the `multiCompiler.watch()`
callback runs synchronously when the first watchRun fails, while `const watcher = ...`
is still in its temporal dead zone.

## Expected

The plugin's own error (`spawn is not defined`) should be reported and the dev server
should not crash with an internal TDZ error.
