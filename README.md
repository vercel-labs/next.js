# Repro: erratic breakpoints with `next dev --turbopack` (vercel/next.js#79424)

The reporter's repo (`bernatfortet/reproduction-app`) is no longer public, and the
original steps require clicking around in VSCode/Cursor. This repro removes the
editor from the loop: it drives **Microsoft's real `vscode-js-debug` adapter**
(the debugger VSCode *and* Cursor use) over DAP, so the behavior is scriptable and
diffable between bundlers.

## Run

```bash
npm install
npm run repro            # next dev --turbopack
npm run repro:webpack    # same run with --webpack, for comparison
npm run sourcemaps       # inspect the source maps the dev server emitted
```

`npm run repro`:

1. starts `next dev --turbopack -p 3000` with `NODE_OPTIONS=--inspect=9230`
   (Next.js moves the app server inspector to 9231, as `.vscode/launch.json` expects),
2. downloads + runs `vscode-js-debug` v1.117.0 in DAP server mode,
3. attaches (`pwa-node` / `request: attach`, exactly like the launch config in the
   [Next.js debugging guide](https://nextjs.org/docs/app/guides/debugging)),
4. sets **one** breakpoint on `src/app/page.tsx:2` (the `console.log`),
5. loads `/`, edits `page.tsx` (reporter step 5), loads `/` twice more,
6. prints each `stopped` event with the stack VSCode would render.

Logs land in `repro-logs/`.

## Observed with next@16.3.1, node 24

```
setBreakpoints(page.tsx:2) -> [{"id":1,"verified":false,"message":"breakpoint.provisionalBreakpoint"}]
STOPPED reason=breakpoint
   Home @ src/app/page.tsx:2:3                     <- expected
STOPPED reason=breakpoint
   Home @ src/app/page.tsx:3:10                    <- unexpected, and the frame below is
   Object.react_stack_bottom_frame @ <cwd>/dist/compiled/react-server-dom-turbopack/cjs/react-server-dom-turbopack-client.node.development.js:5281:13
STOPPED reason=breakpoint
   Home @ src/app/page.tsx:3:10                    <- unexpected again
   initializeElement @ <cwd>/dist/compiled/react-server-dom-turbopack/cjs/react-server-dom-turbopack-client.node.development.js:2161:41
```

* A single breakpoint pauses **3x per page load**: once on the real `console.log`
  line and twice on `page.tsx:3` inside the RSC client-layer deserialization code.
  Pressing "Continue" in the editor therefore drops you in unrelated
  `react-server-dom-*` internals - the "cryptic part of the code" from the issue.
* The stack frames resolve to `<cwd>/dist/compiled/...` (note the missing
  `node_modules/next/`), i.e. paths that do not exist, so the editor cannot open them.
* js-debug logs `Could not read source map for
  file://<cwd>/.next/dev/server/chunks/ssr/turbopack%3A/%5Bturbopack%5D/nodejs/dev/hmr-client.ts:
  Unexpected token ... is not valid JSON` - `turbopack:///[turbopack]/...` sources are
  still emitted (9 of them, see `npm run sourcemaps`) and get resolved relative to the
  chunk directory.
* `npm run sourcemaps` also shows 265 / 285 map sources pointing at files that do not
  exist (mostly `node_modules/next/src/**/*.ts`, which npm does not ship).

`npm run repro:webpack` on 16.3.1 shows the same triple-pause and the same
`page.tsx:3:10` mismapping (webpack even verifies the breakpoint at line 3), so the
extra pauses are the RSC client/server layer duplication rather than Turbopack alone;
the `turbopack://` / unreadable-source-map noise is Turbopack-specific.
Same result with `next@15.5.7 --turbopack` (breakpoint verified at `page.tsx:3:10`,
3 pauses per load).
