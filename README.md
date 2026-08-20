# next/font: template literals (backticks) without substitutions rejected

Issue: https://github.com/vercel/next.js/issues/63041

`next/font` options written as no-substitution template literals (`` `latin` ``) fail
with `Font loader values must be explicitly written literals.` even though they are static.

## Run

```
npm install
npm run build   # or npm run dev, then open http://localhost:3000
```

Expected: build succeeds (backtick strings without interpolation are static literals).
Actual: build fails with `Font loader values must be explicitly written literals.` at app/layout.js:4/5/6.
