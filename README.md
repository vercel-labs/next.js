# next#65636 — pnpm workspace + `output: "standalone"`

Minimal pnpm monorepo: `apps/web` (`output: "standalone"`, uses `next/script`) depends on
workspace package `ui`, which itself depends on `dayjs`.

## Run

```bash
./repro.sh          # build, copy .next/standalone to /tmp/standalone-iso, start it there
curl localhost:3000/
```

## Results observed

| next | node | isolated standalone server |
| --- | --- | --- |
| 14.1.0 | 24.17.0 | OK — `hello from ui ...` (workspace dep + dayjs traced) |
| 15.5.4 | 24.17.0 | OK |
| 16.3.1 | 20.18.1 | OK |
| 16.3.1 | 24.17.0 | **crash at startup**: `Cannot find module '.../@swc/helpers/esm/_interop_require_default.js'` |

So the originally reported "missing shared workspace dependencies" is not reproducible here,
but on next 16.3.1 the standalone server still dies with MODULE_NOT_FOUND under pnpm's isolated
store when run on Node >= 22.12: output tracing copies only `@swc/helpers/cjs/*`, while Node
resolves `@swc/helpers/_/…` through the `module-sync` export condition to `esm/*.js`.
This also fails for a single (non-monorepo) pnpm app, so it is not workspace specific.
