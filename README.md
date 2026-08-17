# Reproduction: next.js#97450 — standalone tracer copies only the Node exports condition

Next.js 16.3.1, `output: "standalone"`, Bun 1.3.14 (isolated linker => `node_modules/.bun/<pkg>@<ver>/node_modules/...`).

## Run

```bash
bun install            # bunfig.toml sets linker = "isolated"
npx next build         # Turbopack production build (Node 24)
cd .next/standalone && bun server.js   # run the standalone output under Bun
curl localhost:3000    # => 500
```

## Observed

`@libsql/isomorphic-ws` (imported only from `instrumentation.ts`, kept external via
`serverExternalPackages`) has platform-conditional exports (`bun: ./web.mjs`, `node: ./node.mjs`).
The tracer copies only `node.mjs` + `package.json` into
`.next/standalone/node_modules/.bun/@libsql+isomorphic-ws@0.1.5/node_modules/@libsql/isomorphic-ws/`.

* `node server.js` -> 200, instrumentation hook loads.
* `bun server.js`  -> boot failure:
  `An error occurred while loading instrumentation hook: Failed to load external module
   @libsql/isomorphic-ws-13bec6b10ee112b6: ResolveMessage: Cannot find module ...`
  Copying `web.mjs`/`web.cjs` into that directory by hand makes `bun server.js` return 200.

## Secondary checks in this repo

* `outputFileTracingIncludes: { "/*": ["./extra-assets/**/*"] }` **is** honored by the Turbopack
  build (`.next/standalone/extra-assets/sentinel.txt` exists), so the report's "Turbopack ignores
  outputFileTracingIncludes" claim did not reproduce; `--webpack` behaves identically.
* `outputFileTracingIncludes: { "/instrumentation": [...] }` is never matched —
  `instrumentation-only-assets/sentinel-instrumentation.txt` is not copied.
* A `"/*"` include pointing at the package directory does pull in `web.mjs`/`web.cjs`, i.e. it works
  as a manual workaround.
