# Repro: misplaced middleware file is silently ignored (next#78948)

App Router project with a `src/` directory. `middleware.js` sits at the project
root (a location Next.js does not accept when `src/` is used), so it is ignored
with no error or warning.

## Run

```bash
npm install
npx next build     # no "ƒ Middleware" row, exit code 0, no warning
npx next dev       # no "Compiled /middleware", response has no x-middleware-ran header
curl -sD - -o /dev/null http://localhost:3000/ | grep -i x-middleware-ran   # prints nothing
```

## Control

`mv middleware.js src/middleware.js` -> build prints `ƒ Middleware  33.1 kB`,
dev prints `✓ Compiled /middleware`, and the response includes
`x-middleware-ran: yes`.

Same silent behavior when the file is placed in `src/app/middleware.js`.

Tested with next@15.3.1, node v24.
