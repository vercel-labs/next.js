# Repro: next.js#50561 — TS types not `| undefined` under `exactOptionalPropertyTypes`

Next.js built-in component prop types declare optional props as `prop?: T`
instead of `prop?: T | undefined`, so passing a possibly-undefined value
(the normal way to forward an optional prop) fails under
`compilerOptions.exactOptionalPropertyTypes: true`.

## Run

```bash
npm install
npm run typecheck   # tsc --noEmit
```

## Expected
No type errors (React's own DOM types include `| undefined`, see the
`AnchorWrapper` control in `app/page.tsx`, which type-checks fine).

## Actual
`TS2375` on `next/link`, `next/image`, `next/script` and `next/form`.
