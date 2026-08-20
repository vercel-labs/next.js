# Repro: next#74722 — TS plugin errors on `PromiseLike` / intersection Promise return types in `"use server"` files

The Next.js TypeScript plugin (`server-boundary` rule) only accepts return types
whose string form matches `/^Promise(<.+>)?$/`, so `PromiseLike<any>` and
`Promise<any> & { ... }` are wrongly rejected with TS71011.

## Run

```bash
npm install
npm run check
```

`check-ts-plugin.mjs` starts `tsserver` with the `next` plugin enabled
(`tsconfig.json` → `plugins: [{ "name": "next" }]`) and prints semantic
diagnostics for `app/actions.ts`.

## Expected

0 diagnostics — both exports are functions returning a promise-like value.

## Actual

```
semantic diagnostics for app/actions.ts: 2
  line 7: TS71011 The "use server" file can only export async functions. Add "async" to the function declaration or return a Promise.
  line 13: TS71011 The "use server" file can only export async functions. Add "async" to the function declaration or return a Promise.
```

Reproduced with next 15.2.0-canary.3 (as reported) and 16.3.1-canary.25, TypeScript 5.7.2.
