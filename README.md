# Repro: VS Code breakpoints do not bind in server code (`next dev`) — vercel/next.js#62008

Headless reproduction of [#62008](https://github.com/vercel/next.js/issues/62008).
It replaces the manual VS Code steps with a script that does what
`vscode-js-debug` does: attach to the Node inspector of `next dev`, read the
source maps of every parsed script, resolve the on-disk source file from the
source map `sources`, set a breakpoint there and hit the route.

## Run

```bash
npm install
npm run repro                                     # app/api/health/route.ts, line 2
FILE=app/page.tsx LINE=2 URL=http://localhost:3000/ npm run repro   # server component
```

The dev server log is written to `logs/next-dev.log`.

## Result with `next@14.1.0` (the version in the issue report)

```
=== scriptParsed url: webpack-internal:///(rsc)/./app/api/health/route.ts
    map.sources: ["webpack://<pkg-name>/./app/api/health/route.ts?fc99"]
    would resolve to: <project>/app/api/health/route.ts?fc99   existsOnDisk: false
breakpoints bound: 0
debugger paused events: 0
```

The server-side source maps carry no on-disk path and no `sourcesContent`: the
only `sources` entry is a `webpack://<pkg>/./…?<hash>` URL whose trailing
`?<hash>` makes every path mapping (`webRoot`, `sourceMapPathOverrides`) point
at a file that does not exist, so the debugger never binds a breakpoint for the
source file. Setting the breakpoint directly on the *generated* location of the
same script does pause execution, which shows V8/`--inspect` is fine and the
failure is purely source-map path resolution.

## Result with a current `next` (verified on 14.1.0 vs 16.3.1)

```bash
npm install next@latest react@latest react-dom@latest
npm run repro                                     # Turbopack
DEV_ARGS=--webpack npm run repro                    # webpack
```

Both Turbopack and webpack emit absolute source paths
(`file:///<project>/app/page.tsx`), the breakpoint binds and the debugger pauses
on every request:

```
BOUND breakpoint {"script":".next/dev/server/chunks/…_.js","source":"file:///<project>/app/page.tsx"}
PAUSED reason=other
breakpoints bound: 2   debugger paused events: 4
```

## Notes

* `NODE_OPTIONS=--inspect` binds 9229 in the CLI process; the Next.js router
  server (where app code is evaluated) falls back to **9230**, which is why
  `attach` configurations pointing at 9229 never see server code.
* `.vscode/launch.json` contains the configurations from the official docs, as
  used in the issue.
