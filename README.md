# Repro for vercel/next.js#45825 — hydration error stack trace points to irrelevant lines

Reporter's CodeSandbox link did not reproduce ("Unable to reproduce in the sandbox"),
so this is a minimal pages-router reproduction of the described scenario:
`components/Widget.js` reads `localStorage` during render (line 5), producing a
client-only `<div className="only-on-client">` on line 9 that the server never rendered.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000 with localStorage.setItem('token','abc') set, then reload
```

## Result

* Next.js 13.1.1 (reported version): dev overlay stack lists only
  `node_modules/react-dom/cjs/react-dom.development.js (12507:0)` frames and the console
  warning stack ends at `at MyApp (webpack-internal:///./pages/_app.js:9:11)` — i.e. the
  reported behavior.
* Next.js 16.3.1-canary.25: the overlay shows `components/Widget.js (9:21) @ Widget`
  with a code frame, an owner stack (`pages/index.js (7:7)`, `pages/_app.js (4:7)`) and a
  server/client tree diff marking `+ <div className="only-on-client">`.
  Raw `console.error` stacks still contain react-dom internal frames only.

Set `"next": "13.1.1"` with react/react-dom 18.2.0 in package.json to see the old behavior.
