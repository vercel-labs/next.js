# next#79010 minimal reproduction

`next/dynamic({ ssr: false })` + `use(serverAction(...))` called during render.

## Run
```
npm install
npm run dev
# open http://localhost:3000
```

## Observed (Next.js 15.3.1 and 16.3.1-canary.26, React 19.1.0)
- UI stays on `Loading...` forever.
- Server action POSTs repeat forever (~1 per second with a 1s delay in the action).
- Console: ``Cannot update a component (`Router`) while rendering a different component (`StockValue`)``.

## Isolation results
- Hoisting `dynamic()` out of the render body does NOT fix it.
- Replacing the server action with a plain `new Promise(...)` created in render: still stuck in an
  infinite suspend/re-render loop, but no POSTs and no `Router` warning -> the `Router` update-in-render
  warning comes specifically from invoking a Server Action during render.
- Root cause is a new promise per render passed to `use()`, so React never resolves; server actions
  additionally dispatch router state updates from render.
