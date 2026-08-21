# Repro: next dev compiles instrumentation for Edge even when no Edge runtime is used (#84995)

`instrumentation.ts` imports `dd-trace` (a Node-only package listed in
`serverExternalPackages`). The app has no `runtime = 'edge'` anywhere, yet
`next dev` compiles "instrumentation Edge" and emits `Module not found` errors
because `serverExternalPackages` is not applied to the Edge instrumentation build.

## Run

```bash
pnpm install
pnpm dev
```

Observed (Turbopack, Next 16.0.0-canary.10 and 16.3.1-canary.25):

```
 ○ Compiling instrumentation Edge ...
 ⨯ ./node_modules/.../dd-trace/packages/datadog-plugin-graphql/src/tools/transforms.js:9:19
Module not found: Can't resolve 'graphql/language/printer'
...
Import trace:
  Edge Instrumentation:
    ...
    ./instrumentation.ts
```

With `next dev --webpack` the same file fails on `Can't resolve 'fs'` from
`@datadog/libdatadog`.

Expected: no Edge instrumentation compilation (or `serverExternalPackages`
respected) when the project has no Edge runtime entrypoints.
