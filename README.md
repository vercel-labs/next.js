# Repro: vercel/next.js#73938 — `unauthorized()` in a Route Handler does not render `unauthorized.tsx`

Next.js `16.3.1-canary.25` (also reported on 15.1.1-canary.4), `experimental.authInterrupts: true`.

## Run

```bash
npm install
npm run dev
curl -i http://localhost:3000/api/unauthorized   # 401, empty body (no HTML)
curl -i http://localhost:3000/dashboard          # 401, renders app/unauthorized.tsx  (control)
```

Also reproduces with `npm run build && npm start`.

## Expected (per docs)

https://nextjs.org/docs/app/api-reference/functions/unauthorized#fetching-data-with-route-handlers
states calling `unauthorized()` in a Route Handler will "return a 401 and render unauthorized.tsx".

## Actual

Route handler responds `401 Unauthorized` with a zero-byte body; `app/unauthorized.tsx` is never rendered.
The same call from a page (`/dashboard`) does render `app/unauthorized.tsx`.
