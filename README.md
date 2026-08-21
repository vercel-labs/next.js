# Repro: next.js#83865 — `--experimental-build-mode=compile` does not set cache headers

Root layout sets `export const dynamic = "force-static"` and `export const revalidate = 86400`.

```bash
npm install

# A) normal build -> Cache-Control: s-maxage=86400, stale-while-revalidate=31449600
npx next build && npx next start -p 3001 &
curl -sI http://localhost:3001/foo | grep -i cache-control

# B) compile + generate-env -> Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
rm -rf .next
npx next build --experimental-build-mode=compile
npx next build --experimental-build-mode=generate-env
npx next start -p 3002 &
curl -sI http://localhost:3002/foo | grep -i cache-control

# C) compile + generate -> cache headers back
rm -rf .next
npx next build --experimental-build-mode=compile
npx next build --experimental-build-mode=generate
npx next start -p 3003 &
curl -sI http://localhost:3003/foo | grep -i cache-control
```

Observed with next 15.5.2 and next@16.3.1-canary.26: in (B) the route is treated as
fully dynamic (`ƒ (Dynamic)` in the build output, no `x-nextjs-prerender` header) and the
`revalidate` value is not used for `Cache-Control`.
