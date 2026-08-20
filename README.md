# Repro: infinitely recursive component crashes build/dev with no actionable error (vercel/next.js#58494)

`app/components/SearchPage.tsx` exports a component that renders itself (the reporter's
original mistake: a forgotten `import { SearchPage } from "@depict-ai/react-ui"`).

## Run

```bash
npm install
npm run build     # crashes
# or
npm run dev       # then request http://localhost:3000/ -> server crashes
```

## Observed

- Next 14.0.3-canary.9 (original report): `RangeError: Maximum call stack size exceeded`
  with only minified `nO`/`nR`/`nT` frames from `app-page.runtime.prod.js`.
- Next 16.3.1-canary.25 + React 19: the worker/dev server dies with
  `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed -
  JavaScript heap out of memory` / `Next.js build worker exited with code: null and signal: SIGABRT`.

Either way nothing points at the recursing component.

## Expected

An error naming the offending component, e.g.
`Component nesting too deep, might exceed maximum call stack size soon. ... SearchPage: app/components/SearchPage.tsx:4`.
