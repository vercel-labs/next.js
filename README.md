# Repro: vercel/next.js#23756 — `--profile` production build mangles component names

`next build --profile` (with `productionBrowserSourceMaps: true`) does swap in the React
profiling build, but the minifier still mangles function names, so React DevTools Profiler
shows names like `e` / `(anonymous)` instead of `UniqueProfilerComponent` /
`AnotherNamedChildComponent`.

## Run

```bash
npm install
npx playwright install chromium
npm run build            # Turbopack; use `npm run build:webpack` for webpack
npm start &
npm run verify           # prints React fiber type names walked up from #out
```

`verify-names.js` reads the React fiber attached to `#out` and prints `fiber.type.name`
for each function component, which is exactly what DevTools displays.

## Observed (Next.js 16.3.1)

```
{ "names": ["e", "(anonymous)", "x", "d", ...], "hasProfiling": true }
```

`hasProfiling: true` shows the profiling build of react-dom is active, so only name
mangling is broken. Grepping the built client chunk shows the same:

```
function e({count:t}){...}   // AnotherNamedChildComponent
t.s(["AnotherNamedChildComponent",0,e,"default",0,function(){...}])  // default export lost its name
```

Webpack (`--profile --webpack`) is equally affected: `function u(){...} function c({count:n}){...}`.

## Expected

With `--profile`, minification should keep function names (`keep_fnames` / `keep_classnames`)
so the Profiler shows real component names.
