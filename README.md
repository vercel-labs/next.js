# Repro: `typeof window` is `"object"` inside web workers (next.js#62256)

Next.js replaces `typeof window` with the constant `"object"` in every browser-layer
app source file, including files that are compiled into a `new Worker(new URL(...))`
web worker bundle. Inside the worker `window` does not exist, so guards of the form
`if (typeof window !== 'undefined') { window.x = 1 }` (e.g. the Three.js
`window.__THREE__` snippet) enter the branch and then throw `window is not defined`.

## Run

```bash
npm install
npm run dev          # turbopack
# or: npx next dev --webpack
# or: npm run build && npm start
```

Open http://localhost:3000 and read `<pre id="result">` / the browser console.

## Observed (next 16.3.1, dev turbopack, dev webpack and production start)

```json
{"typeofWindow":"object","typeofSelf":"object","windowAccessError":"window is not defined"}
```

## Expected

`typeof window` should be `"undefined"` inside a worker bundle.

## Notes

`node_modules` in the app browser layer are excluded from this replacement
(`packages/next/src/build/swc/options.ts` deletes `jsc.transform.optimizer.globals.typeofs.window`),
so an imported `three` build no longer throws — but first-party app code still does.
