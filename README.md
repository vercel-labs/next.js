# Repro: module side effects re-run / globals lost on dynamic App Router routes in `next dev`

Issue: https://github.com/vercel/next.js/issues/84198
(The reporter's repo `shinobijs/nextjs-sample` is gone/404, so this is a minimal rebuild.)

## Run

```bash
npm install
npm run dev
# static route: no extra module evaluations
curl localhost:3000/ ; curl localhost:3000/
# dynamic route: every request re-evaluates lib/counter.ts
curl localhost:3000/1234 ; curl localhost:3000/1234
```

Watch the dev server stdout.

## Expected

`lib/counter.ts` is evaluated once per server process. Its module side effect
(stand-in for a Mongoose model / Redis client / cache singleton) runs once and
`globalThis.__requests` stays consistent.

## Actual (Next 15.5.4 webpack dev and 16.3.1-canary.26 turbopack dev)

Requests to `/` behave correctly. Every request to the dynamic route `/[user]`
triggers an extra evaluation of `lib/counter.ts`:

- in a freshly spawned child process (`jest-worker` `processChild.js`, new pid each
  time — in 15.x this is `server/dev/static-paths-worker` used to resolve
  `generateStaticParams`), where `globalThis.__requests` is `undefined`;
- and sometimes in the main `next-server` process, which resets the global
  singleton back to `0` (destroying the singleton).
