# Turbopack CSS HMR is one revision behind (vercel/next.js#93052)

Minimal reproduction of stale CSS served by `next dev` (Turbopack) when a PostCSS
plugin that reports file dependencies (here `@tailwindcss/postcss` v4) is used.

## Run

```bash
npm install            # do NOT patch @tailwindcss/postcss
npm run dev            # Turbopack
node scripts/verify.mjs 3000 3
```

Each iteration writes one new `border-radius` value to `app/globals.css`, waits 7s
(so this is not a debounce/coalescing artifact), and reads the served CSS chunk.

Observed: every iteration prints `STALE` and the served value is the value from the
*previous* save.

Control: `npm run dev:webpack` then `node scripts/verify.mjs 3000 3` prints `OK`
for every iteration.

## Mechanism

```bash
rm -f /tmp/noop.log && NOOP_LOG=1 npm run dev
# in another shell: touch one edit into app/globals.css, then
cat /tmp/noop.log
```

Two PostCSS invocations per single save:

```
match=false mtime=1787288625767.4075   # stale content, NEW mtime
match=true  mtime=1787288625767.4075   # fresh content, SAME mtime
```

`@tailwindcss/postcss` caches compiled output keyed on `mtimeMs`, so invocation 1
caches stale output under the new mtime and invocation 2 hits that cache.
