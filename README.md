# Repro: vercel/next.js#56702 — VSCode client-side breakpoints / "Could not read source map"

Minimal Next.js App Router app plus a headless harness that drives the **real VSCode
JavaScript debugger** (`vscode-js-debug`, the same adapter VSCode uses) over DAP, so the
issue can be checked without a GUI.

`app/page.tsx` is a client component with two breakpoint targets:

* line 5 — executed during render/hydration
* line 7 — executed inside the click handler

## Run

```bash
npm install
npm run dev                     # terminal 1 (http://localhost:3010)
npm run debug:check             # terminal 2
```

`debug:check` downloads the standalone `js-debug` DAP server, launches Chrome with the
same config as `.vscode/launch.json` (`type: chrome`, `webRoot: ${workspaceFolder}`),
sets breakpoints at `app/page.tsx:5,7`, reloads the page, clicks the button, and prints
every breakpoint/stop event plus all debug-console output.

Set `CHROME=/path/to/chrome` if Chrome is not auto-detected.

## Observed on next@16.3.1-canary.25 (Turbopack dev, js-debug 1.117.0)

Breakpoints bind and are hit:

```
breakpoint event: {"id":1,"verified":true,"source":{"path":".../app/page.tsx"},"line":5,"column":3}
STOPPED: {"reason":"breakpoint","hitBreakpointIds":[1]}
STACK ["/…/app/page.tsx:5:3 Home", "…/react-dom-client.development.js:28476:20 …"]
```

but the debug console still reports unreadable source maps:

```
Could not read source map for file:///…/node_modules/next/dist/compiled/react-server-dom-turbopack/cjs/react-server-dom-turbopack-client.browser.development.js:
  ENOENT: no such file or directory, open '…/cjs/" + sourceMap))'
Could not read source map for file:///…/_next/static/chunks/turbopack%3A/%5Bturbopack%5D/browser/runtime/dom/dev-backend-dom.ts:
  Unexpected token '', "" is not valid JSON
```

The first one comes from the string literal `"\n//# sourceMappingURL=" + sourceMap` at
lines 795/3430 of the shipped `react-server-dom-turbopack` dev bundle, which the debugger
parses as a real `sourceMappingURL` comment.

With `next dev --webpack` on the same canary the result is identical (breakpoints bind and
hit) and the equivalent message appears for
`next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js`.

The original report's errors (`next/dist/compiled/@next/react-refresh-utils/dist/runtime.js.map`
ENOENT) reproduce on next@13.5.11, where those `.map` files are missing from the package;
current canary ships them, so those two messages are gone.
