# Repro harness for vercel/next.js#52073

"debugger in client code is not getting hit" (App Router, `"use client"`).
The issue has no reproduction link ("na"), so this is a minimal harness that
verifies debugger/breakpoint behavior in a client component headlessly via CDP.

## Files
- `app/counter.js` – `"use client"` component with `debugger;` inside `useEffect`.
- `bp2.mjs` – attaches a CDP `Debugger`, locates the client component code in the
  served chunk, sets a breakpoint by URL, reloads and prints every pause
  (reason, hit breakpoint ids, script URL, line, function name).

## Run
```bash
npm install
npx playwright install chromium
npm run dev            # Turbopack dev, port 3000
node bp2.mjs http://localhost:3000/
# webpack dev:
npm run dev:webpack    # port 3001
node bp2.mjs http://localhost:3001/
```

## Result on next@16.3.1-canary.25 (Node 24, headless Chromium 151)
Turbopack:
```
PAUSE reason=other hitBreakpoints=[] scriptUrl=.../chunks/_0ws7jtb._.js line=19 fn=Counter.useEffect
PAUSE reason=other hitBreakpoints=["1:20:0:..._0ws7jtb._.js"] line=20 fn=Counter.useEffect
```
webpack (`next dev --webpack`):
```
PAUSE reason=other hitBreakpoints=[] scriptUrl=webpack-internal:///(app-pages-browser)/./app/counter.js line=15 fn=Counter.useEffect
```
Both the `debugger;` statement and a breakpoint inside the client component
pause execution. The Turbopack client chunk's source map is an indexed map whose
first section maps to `file:///.../app/counter.js` with `sourcesContent`, so the
original client source is available to DevTools. next@13.4.7 (the reported
version) also pauses on the same `debugger;` statement.
