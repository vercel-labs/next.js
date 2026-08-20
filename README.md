# Repro: next.js#69519 — dynamic `import()` of a `.ts` file inside `instrumentation.ts`

`instrumentation.ts` imports a `.ts` module through a specifier computed at runtime
(the issue used `glob()` results; here `fs.readdir`). The specifier is not statically
analyzable, so the bundler leaves it for the runtime and Node cannot load the raw
`.ts` file. The whole instrumentation hook then fails.

`variants/instrumentation.static.ts.txt` (a statically written `./models/user.model.ts`
specifier) works fine, so only runtime-computed specifiers break.

## Run

```bash
npm install
npm run dev            # Turbopack dev, then open http://localhost:3000
# or
npm run build:webpack && npm start
```

## Observed on next@16.3.1-canary.25 (node 24)

- `next dev` (Turbopack): `Module not found: Can't resolve './ROOT//models/' <dynamic>`
  plus `An error occurred while loading instrumentation hook: Cannot find module 'unknown'`.
  `process.cwd()` is constant-folded to `/ROOT/` at build time.
- `next build` (Turbopack): build fails with the same module-not-found errors.
- `next build --webpack` + `next start`: builds with only a
  `Critical dependency: the request of a dependency is an expression` warning, then the
  server never boots — `Failed to prepare server Error: An error occurred while loading
  instrumentation hook: Cannot find module '<cwd>/models/user.model.ts'` and every request
  returns 500.

Original report saw `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: ... Unknown file extension ".ts"`;
current canary surfaces `MODULE_NOT_FOUND`, but the hook still cannot load `.ts` files dynamically.
