# Repro: next.js#95367 — Pages Router returns props of a different route (hydration mismatch) under parallel client-side navigation

Node + npm port of https://github.com/exoRift/next-prop-error-repro (original required Bun).
Next 16.2.9 / React 19.2.4. Four pages `/a` `/b` `/c` `/d`, each with `getServerSideProps` returning `{ foo: 1|2|3|4 }`
and a component that renders `foo`.

`scan.mjs` opens 4 parallel Puppeteer pages in one browser context and repeatedly navigates them via
`window.next.router.push('/<route>')`, failing the run on any hydration mismatch / page error.

## Run (dev)

```bash
npm install
npm run setup-puppeteer
npm run dev            # terminal 1
npm run scan           # terminal 2 -> exits 1 with "Hydration failed ... server rendered text didn't match"
```

## Run (production)

```bash
npm run build && npm start   # terminal 1
npm run scan                 # terminal 2 -> minified React error #418 (hydration text mismatch)
```

Env knobs: `PARALLEL` (default 4), `ITERATIONS` (default 10), `HEADLESS=0`.
`PARALLEL=1` does not reproduce; failures show e.g. `<Comp foo={2}>` server text `2` vs client text `3`.
