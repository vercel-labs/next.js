# Repro: instrumentation file ignored in `output: standalone` / Vercel when custom `pageExtensions` are used

Upstream issue: https://github.com/vercel/next.js/issues/86117

Next.js 16.0.3, Pages Router, `pageExtensions: ["page.tsx", "server.ts"]`,
instrumentation file named `src/instrumentation.server.ts`.

## Steps

```bash
npm install
npm run build

# BROKEN (this is what Vercel / self-hosted standalone runs)
PORT=3001 npm run start:standalone
curl localhost:3001/api/hello
# -> server log never prints "Registering instrumentation (inside register fn)..."
# -> .next/standalone/.next/server/instrumentation.js does not exist,
#    although .next/server/instrumentation.js was built.

# WORKS (plain `next start` reads .next/server/instrumentation.js directly)
PORT=3002 npx next start
curl localhost:3002/api/hello
# -> logs "Registering instrumentation (inside register fn)..."
```

Control: with default `pageExtensions` and `src/instrumentation.ts`, the standalone
output does contain `.next/standalone/.next/server/instrumentation.js` and the hook runs.

## Root cause pointer

`next/dist/build/index.js`:

```js
const { name: fileBaseName } = path.parse(rootPath) // "/src/instrumentation.server.ts" -> "instrumentation.server"
if (isAtConventionLevel && fileBaseName === INSTRUMENTATION_HOOK_FILENAME /* "instrumentation" */) {
  instrumentationHookFilePath = rootPath
}
const hasInstrumentationHook = Boolean(instrumentationHookFilePath)
```

The root-file detection regexp accepts multi-dot page extensions, but `path.parse().name`
keeps the extra `.server` segment, so `hasInstrumentationHook` stays `false`.
`copyTracedFiles()` (standalone) and `build/adapter/build-complete.js` (Vercel build output)
are both gated on `hasInstrumentationHook`, so `instrumentation.js` is never included in the
deployed output — while `next start` / `next dev` still find it on disk.
