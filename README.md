# Repro: `outputFileTracingExcludes` glob matches unrelated files (issue #62331)

`outputFileTracingExcludes: { '*': ['data/**/*'] }` removes
`node_modules/next/dist/lib/metadata/**` from a `output: 'standalone'` build,
because the exclude globs are compiled with picomatch `{ contains: true }`
(`next/dist/build/collect-build-traces.js`), so `data/**/*` matches any path that
*contains* `data/...` — including `.../lib/metadata/generate/icons.js`.
A leading `./` does not help.

## Run

```bash
npm install
npx next build --webpack        # webpack build path (Turbopack traces are not affected)
ls .next/standalone/node_modules/next/dist/lib | grep metadata   # -> nothing
node .next/standalone/server.js
# Error: Cannot find module '../../../lib/metadata/get-metadata-route'
```

Removing `outputFileTracingExcludes` from `next.config.js` keeps
`node_modules/next/dist/lib/metadata` in the standalone output and the server boots.

Verified with next@16.3.1, Node 24.
