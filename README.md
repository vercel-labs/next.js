# Turbopack file tracing includes the whole repository root

Repro for https://github.com/vercel/next.js/issues/84960 (Next.js 16.3.1).

A server module reads a file through a **dynamic** path built from
`process.cwd()` (`path.join(process.cwd(), ...segments)`), which is what
`@opentelemetry/instrumentation` / `@sentry/nextjs` do internally.
Turbopack turns this into the pattern `('/ROOT/' <dynamic> | '/ROOT' <dynamic>)`
and traces the **entire project root** into `page.js.nft.json`, producing
oversized serverless functions.

## Run

```bash
npm install
npm run build          # next build --turbopack
node check-trace.mjs
```

Output:

```
total traced files: 122
project-root files traced: [ '../../../Makefile', '../../../README.md',
  '../../../big-unrelated-file.txt', '../../../components.json' ]
REPRODUCED: repo root is in the trace
```

## Controls

* `npm run build:webpack` (`next build --webpack`) → 99 traced files, the only
  project file is `package.json`. No root files.
* Replace `readDynamic('package.json')` with `readStatic()` in `app/page.tsx`
  (fully static path) → Turbopack traces 110 files, only `package.json`.

So the over-tracing is specific to Turbopack + a dynamic `process.cwd()` path:
instead of falling back to nothing (or to the referenced file), it includes every
file under the project root recursively (`app/`, `lib/`, `Makefile`,
`README.md`, `components.json`, lockfiles, unrelated assets...).
