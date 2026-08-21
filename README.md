# Repro: server actions fail when `x-forwarded-host` has no port (vercel/next.js#77556)

Docker-free mirror of https://github.com/nanto/nextjs-nginx-proxy-example.
`proxy.js` mimics nginx-proxy defaults: it sets `x-forwarded-host` **without** the port
and puts the port in `x-forwarded-port`.

## Run

```bash
cd app && npm install && npx next dev &   # http://localhost:3000
cd .. && node proxy.js &                  # http://localhost:3333 -> 3000
npm i playwright && npx playwright install chromium
node repro.mjs
```

Or manually: open http://localhost:3333/ and click "Increment".

## Expected

`Count: 0` becomes `Count: 1`.

## Actual

The POST to `/` returns 500, the client throws `Invalid Server Actions request.`,
and the dev server logs:

```
`x-forwarded-host` header with value `localhost` does not match `origin` header with value `localhost:3333` from a forwarded Server Actions request. Aborting the action.
```

Reproduced with next@15.3.0-canary.24 and next@16.3.1-canary.26.
