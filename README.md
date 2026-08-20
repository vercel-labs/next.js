# Repro: vercel/next.js#68740 — instrumentation native modules broken in `output: 'standalone'`

Repaired mirror of https://github.com/moshie/nextjs-issue (its `package-lock.json` pointed at a
private Artifactory registry and could not be installed publicly; deps bumped to Next canary).

```bash
npm install --ignore-scripts   # @splunk/otel ships prebuilt .node files, no compile needed
npm run build                  # Turbopack (default) production build, output: 'standalone'
npm run verify
cd .next/standalone && node server.js
```

Observed (Next 16.3.1-canary.25, node 22.14.0, linux x64):

* Turbopack build: `node_modules/@splunk/otel/prebuilds/linux-x64/@splunk+otel.abi127.node` **is**
  copied into `.next/standalone`, but the server logs
  `No native build was found for ... abi=127 ... loaded from: /ROOT/node_modules/@splunk/otel`
  — the bundled instrumentation resolves the prebuild from the literal `/ROOT` build placeholder
  instead of the standalone directory.
* `next build --webpack`: `@splunk/otel` is not copied into `.next/standalone` at all
  (the originally reported behavior), and the server logs
  `... loaded from: <cwd>/.next/standalone/.next`.

Both paths mean profiling/metrics extensions of `@splunk/otel` never load from a standalone build.
