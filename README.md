# Repro: `next dev` (webpack) makes the debugger read source maps that do not exist (vercel/next.js#65795)

Original report: https://github.com/vercel/next.js/issues/65795

Minimal `app/` project pinned to the reporter's version (`next@14.3.0-canary.63`).

## What happens

`next dev` emits Next.js' own client-component modules into
`.next/server/vendor-chunks/next.js` through the flight loader. Those generated
`createProxy(...)` modules keep the trailing `//# sourceMappingURL=<name>.js.map`
comment of the original file in `next/dist/client/components/`, un-wrapped, as a
real comment inside the chunk:

```
1876:  //# sourceMappingURL=render-from-template-context.js.map
```

V8 reports that URL for the whole chunk, so any debugger (VS Code's `js-debug`,
Chrome DevTools, `node --inspect`) resolves it next to the chunk and fails:

```
Could not read source map for file:///.../.next/server/vendor-chunks/next.js:
ENOENT: no such file or directory, open '/.../.next/server/vendor-chunks/render-from-template-context.js.map'
```

The same happens for `app-router.js.map`, `client-page.js.map`,
`error-boundary.js.map`, `layout-router.js.map` and `not-found-boundary.js.map`.

## Reproduce in VS Code

1. `npm install`
2. Start the `next dev` launch configuration (`.vscode/launch.json`).
3. Load http://localhost:3000 and watch the Debug Console.

## Reproduce headlessly (no VS Code)

```bash
npm install
npm run verify
```

`scripts/verify.sh` starts `next dev` under `node --inspect` (the inspector VS
Code attaches to), attaches a CDP client, requests `/`, and prints every
`Debugger.scriptParsed` whose `sourceMapURL` cannot be read. It exits `1` when
the bug reproduces. `npm run check-chunks` alone greps the emitted server chunks
for bare `//# sourceMappingURL=` comments pointing at missing files.
