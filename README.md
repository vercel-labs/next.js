# Repro: `next/dynamic` causes extra parent re-renders (issue #77215)

Minimal App Router repro. Each page is a client component that counts and logs its own
render count (`[render] ...` in the browser console, also rendered into `#parent-renders`).

| route | parent contains |
| --- | --- |
| `/baseline` | nothing |
| `/static` | statically imported `<ChildStatic />` |
| `/dynamic` | `next/dynamic` imported `<Child />` |
| `/dynamic-suspense` | same dynamic child wrapped in `<Suspense>` |

## Run

```bash
npm install
npm run build && npm start   # production
# or: npm run dev
node measure.js http://localhost:3000 prod   # needs `npm i -D playwright && npx playwright install chromium`
```

Then open `/static` and `/dynamic` and compare console `[render]` lines.

## Observed (next@15.3.0-canary.8, react 19.0.0)

Production (`next build && next start`), client renders of the parent:

```
/static             -> 1
/dynamic            -> 5
/dynamic-suspense   -> 1
```

Dev (`next dev`, includes React's dev double-invoke):

```
/static             -> 5
/dynamic            -> 9
/dynamic-suspense   -> 5
```

With `next@16.3.1-canary.26` / react 19.2.8 the production numbers are 1/1/1 (fixed),
but `next dev` still shows 9 vs 5, i.e. the extra parent renders remain in dev.
Wrapping the dynamic child in `<Suspense>` removes the extra renders in every case.
