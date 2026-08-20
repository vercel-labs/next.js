# Reproduction attempt for vercel/next.js#62078

Claim in the issue thread: the docs middleware matcher sample
`'/((?!api|_next/static|favicon.ico).*)'` does not match the root route `/`, and
adding an explicit `'/'` matcher "breaks localhost".

## Run

```bash
npm install
npm run dev
curl -sI http://localhost:3000/      # look for x-middleware-ran
curl -sI http://localhost:3000/about
```

`middleware.ts` sets an `x-middleware-ran: <pathname>` response header and logs each invocation.

## Result (Next.js 16.3.1, also verified on 14.1.1)

- With both matchers (`'/((?!api|_next/static|favicon.ico).*)'` and `'/'`): dev server starts fine,
  `/` -> `200` + `x-middleware-ran: /`, `/about` -> `200` + `x-middleware-ran: /about`. No error overlay.
- With only the docs sample matcher: `/` still returns `x-middleware-ran: /` — the root route IS matched
  (`.*` can match the empty string).
- `next build` + `next start` behave identically.

Not reproducible as described.
