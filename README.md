# Repro harness for vercel/next.js#53188

Intercepting Routes + URL query params + hard navigation + soft navigation.

Minimal app (mirrors nextgram): `app/page.js` (feed), `app/photos/[id]/page.js` (full page),
`app/@modal/(.)photos/[id]/page.js` (interceptor).

## Run

```bash
npm install
npm run dev            # terminal 1
npm run repro          # terminal 2 (Playwright, needs `npx playwright install chromium`)
```

`test2.mjs` walks the reporter's steps (start at `/?example=21`, soft nav -> modal, reload -> full page,
browser back, soft nav again) for plain and query-carrying links, and for start URLs with/without query.
`test3.mjs` additionally sets the query via a client-side soft navigation first.
`test-nextgram.mjs` runs the same steps against the reporter's linked demo https://nextgram.vercel.app.

Each step prints whether `#modal` (intercepted) or `#full-page` (not intercepted) rendered.

## Result observed

next@16.3.1-canary.25 (dev + `next build && next start`), next@15.0.3 dev and next@13.4.12 dev
all render `#modal` at every soft navigation, including after the hard reload + browser back.
The reporter's own demo also renders the modal on the final soft navigation. Not reproduced.
