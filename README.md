# Repro: Next.js breaks `NODE_OPTIONS` preload flags (vercel/next.js#77550)

Next.js re-serializes `NODE_OPTIONS` in `packages/next/src/server/lib/utils.ts`
(`parseNodeArgs` / `formatNodeOptions`) before spawning its worker, which corrupts
valid Node preload flags.

## Run

```bash
npm install
./repro.sh          # runs all three cases
```

Or individually:

```bash
NODE_OPTIONS="-r $PWD/a.cjs" npx next dev
# node: --r= is not allowed in NODE_OPTIONS

NODE_OPTIONS="--require $PWD/a.cjs --require $PWD/b.cjs" npx next dev
# Error: Cannot find module '<cwd>/a.cjs <cwd>/b.cjs'

NODE_OPTIONS="--require=$PWD/a.cjs --require=$PWD/b.cjs" npx next dev
# starts, but only b.cjs is preloaded in the worker: a.cjs is silently dropped
```

Plain `node -r ...` / `node --require ... --require ...` works in all three cases.

Real-world impact: New Relic, Dynatrace OneAgent and HTTP Toolkit all inject `-r`
into `NODE_OPTIONS`.
