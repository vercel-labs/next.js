# Repro: revalidatePath/revalidateTag is a no-op inside setTimeout (vercel/next.js#72578)

Repaired fork of https://github.com/trieb-work/nextjs-bug-revalidatetag-inside-settimeout
(the original failed to build on modern canary: `unstable_after` no longer exists in `next/server`).

## Run

```bash
npm install
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

Then:

```bash
curl -s localhost:3000            # note the random number (ISR cached, revalidate = 120)
curl -s localhost:3000/normal     # revalidatePath('/') called directly
curl -s localhost:3000            # NEW number  -> works
curl -s localhost:3000/timeout    # revalidatePath('/') called inside setTimeout (not awaited)
sleep 2; curl -s localhost:3000   # SAME number -> BUG, no revalidation, no error logged
curl -s localhost:3000/awaitedTimeout  # setTimeout awaited
curl -s localhost:3000            # NEW number -> works
```

`/timeoutWithAfter` (setTimeout inside `after()`) is also broken.
The route's `console.log` inside the timeout does run, so the callback executes;
only the revalidation is silently dropped because the request store is gone.
