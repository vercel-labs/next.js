# Repro: inline `next/script` with an `id` only executes on the first page visit (#39141)

Next.js version: 16.3.1-canary.25 (pages router)

## Steps

```bash
npm install
npm run dev
# open http://localhost:3000 with devtools console open
# click "Go to other page", then "Back home" a few times
```

Console output:

- First load: `[HOME] inline script WITH id ran ...` and `[HOME] inline script WITHOUT id ran ...`
- Every subsequent client-side navigation back to `/`: only `WITHOUT id` logs.

The `<Script id="inline-with-id">` body never runs again after the initial render,
because `next/script` records the id in its global cache and skips re-injection.

Automated check (requires `npm i playwright` and browsers installed):

```bash
node check.mjs   # prints "WITH id count: 1" / "WITHOUT id count: 4"
```
