# Repro scaffold for vercel/next.js#96823

Windows-only: `next build` (webpack) crashes in `FlightClientEntryPlugin.createActionAssets`
with `TypeError: Cannot read properties of undefined (reading 'client')` when the app has no
first-party Server Actions but a dependency (`@clerk/nextjs` keyless mode) registers actions.

Minimal App Router app: `output: 'standalone'`, next 16.2.11, webpack builder, one node page and
one edge page, zero first-party `"use server"` files. Clerk's `keyless-actions.js` supplies the
only Server Actions.

## Run

```bash
npm install
npm run probe   # patches node_modules/next .../flight-client-entry-plugin.js to log plugin state
npm run build   # next build --webpack
```

`npm run probe` prints, once per compiler, right before the crashing lookup:

```
[probe] isEdge= <bool> serverActions= <n> serverActionModules= [...] edgeServerActions= <n> edgeServerActionModules= [...]
```

## Observed

- Linux (Node 24, next 16.2.11): build succeeds. Probe prints
  `isEdge= false serverActions= 4 serverActionModules= ["app/_not-found/page","app/page"]` and
  `isEdge= true serverActions= 4 serverActionModules= ["app/_not-found/page","app/page"] edgeServerActions= 4 edgeServerActionModules= ["app/edge/page"]`,
  i.e. the two maps are symmetric and `server-reference-manifest.json` resolves every worker
  module id. Not reproduced on Linux.
- Windows: per the issue, `serverActionModules` is `{}` while `serverActions[id].workers` is
  populated, so `pluginState.serverActionModules[name]['server']` throws. Run `ci/windows-build.yml`
  (copy into `.github/workflows/`) on `windows-latest` to check.

Note: `serverActions[id].workers[bundlePath]` is filled in `injectActionEntry` *before* the action
entry module is added, while `serverActionModules` is only filled in `createActionAssets` from
`traverseModules`. Any Windows condition that keeps the `next-flight-action-entry-loader` module
out of the traversal (or out of a named chunk group) yields exactly the reported asymmetry.
Plugin state also crosses process boundaries: with webpack build workers the edge-server compiler
reads `serverActions`/`serverActionModules` resumed from the server compiler's worker.
