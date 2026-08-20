# next#61728 — instrumentation.ts and NEXT_RUNTIME

Verified with `next@16.3.1` (also reproduces with `next@15.5.7`).

```bash
npm install
npm run dev            # logs register() for nodejs, then edge (middleware/proxy exists)
npm run build          # turbopack: builds, but node-only module lands in "Edge Instrumentation" import trace
npm run build:webpack  # webpack: FAILS -> UnhandledSchemeError: Reading from "node:fs" ... ./utils/node-instrumentation.ts
```

What reproduces:

- Guarding node-only code with an *indirect* `NEXT_RUNTIME` read (`getNextRuntime()` from
  `./env.ts`) is not inlined, so `./utils/node-instrumentation.ts` (imports `node:fs`,
  `node:async_hooks`) is bundled for the edge instrumentation.
  - `next build --webpack` fails to compile.
  - `next build` (Turbopack) succeeds but reports the module under
    `Import traces: Edge Instrumentation`.
- Using the literal `process.env.NEXT_RUNTIME === 'nodejs'` guard builds fine.

What does NOT reproduce anymore (original report, next@14):

- `register()` runs once per compiled runtime: `nodejs` first, and `edge` only when the app
  contains edge code (here `middleware.ts`). Editing `instrumentation.ts` in `next dev` does
  not re-run `register()` in the edge runtime.
