# Reproduction for vercel/next.js#88466

Next.js globally monkey-patches Node's `setImmediate`, `clearImmediate`,
`node:timers.setImmediate`, `node:timers/promises.setImmediate` and
`process.nextTick` (see `packages/next/src/server/node-environment-extensions/fast-set-immediate.external.ts`,
`install()` runs on module load unconditionally, even when Cache Components is off).

## Run

```bash
npm install
npm run dev      # then open http://localhost:3000/api/probe
# or
npm run build && npm start
```

## What to look for

- `/api/probe` compares the timer functions inside the Next.js server process
  with the same functions in a pristine `node -e` child process.
  Inside Next.js they are named `patchedSetImmediate`,
  `patchedSetImmediatePromise` and `patchedNextTick`.
- `/prerender-probe` calls `setImmediate()` from "userspace" code during a
  render. During a staged prerender the returned object is a `NextImmediate`
  instance, not Node's `Immediate`, so `clearImmediate`/`ref`/`unref`
  consumers and any `instanceof`/duck-typing checks observe Next.js' shim.
