# Reproduction for vercel/next.js#68868

`next lint` / ESLint with `eslint-config-next` does not report type errors
(e.g. `const test: string = 123`); only `next build` (TypeScript) does.

Both apps contain the same `app/page.tsx` with:
- a type error (`const test: string = 123`)
- an unused variable (a rule `next/typescript` does cover)

## next-14 (next 14.2.5, as reported)

```bash
cd next-14 && npm install
npx next lint    # -> Failed to load config "next/typescript" to extend from.
# with only "next/core-web-vitals": "No ESLint warnings or errors"
npx next build   # -> Type error: Type 'number' is not assignable to type 'string'.
```

`node_modules/eslint-config-next@14.2.5` ships only
`index.js`, `core-web-vitals.js`, `parser.js` — no `typescript.js`, although the
docs advertise the `next/typescript` config.

## next-latest (next 16.3.1)

```bash
cd next-latest && npm install
npx eslint .     # -> only "'unused' is assigned a value but never used" (no type error)
npx next build   # -> app/page.tsx(3,9): error TS2322: Type 'number' is not assignable to type 'string'.
```

`next/typescript` now exists and is loaded, but it is a non type-aware
typescript-eslint config, so type errors are still never reported by lint.
