# Repro: vercel/next.js#78323 — next-rspack CSS errors have no source location

`app/example.scss` contains invalid CSS (`--test-variable: var(var(--value))`).

## Run

```bash
npm install
npx next build
```

## Observed (next 15.3.1 + next-rspack 15.3.1)

```
 ⚠ Compiled with warnings in 0ms

⚠ Unexpected token Function("var") at static/css/2cefff9d3ed3ad50.css:0:42
```

The referenced chunk `static/css/2cefff9d3ed3ad50.css` does not exist in `.next/`, and there is no
mapping back to `app/example.scss`. Build exits 0.

## Observed (next/next-rspack canary 16.3.1-canary.26)

No warning or error at all. The whole `:root { ... }` rule is silently dropped:
`.next/static/css/ef46db3751d8e999.css` is empty.

## Turbopack (same source, `next.config.ts` without `withRspack`) reports it properly

```
./app/example.scss.css:1:42
Error: Parsing CSS source code failed
> 1 | :root{--value: #fff;--test-variable: var(var(--value))}
  |                                          ^
Unexpected token Function("var")
```
