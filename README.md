# Repro: next.js#64064 — `window.history.replaceState` re-renders components using `useParams`

Minimal reproduction of https://github.com/vercel/next.js/issues/64064

- `app/WithParams.tsx` calls `useParams()` and renders its own render count.
- `app/WithoutParams.tsx` is identical but never calls `useParams()`.
- `app/ReplaceStateButton.tsx` calls `window.history.replaceState(null, '', '?test=...')`.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # or: npm run build && npm start (then use port 3001)
npm run check          # clicks the button 3 times and prints render counts
```

## Observed (next@16.3.1-canary.25)

`next dev` (each click adds 2 renders because of React StrictMode double-render):

```
before          withParams: 2   plain: 2
after click 1   withParams: 4   plain: 2
after click 2   withParams: 6   plain: 2
after click 3   withParams: 8   plain: 2
```

`next build && next start`:

```
before          withParams: 1   plain: 1
after click 1   withParams: 2   plain: 1
after click 2   withParams: 3   plain: 1
after click 3   withParams: 4   plain: 1
```

Expected: the path params did not change, so the component using `useParams()` should not
re-render. Instead it re-renders on every `history.replaceState` call, while the component
that does not use `useParams()` never re-renders.
