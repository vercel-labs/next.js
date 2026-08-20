# Repro: i18n default locale prefix (`/en-US`) is not redirected to `/` (vercel/next.js#21040)

Next.js `16.3.1` (reported since 10.0.5), pages router i18n sub-path routing.

## Run

```bash
npm install
npm run dev        # or: npm run build && npm start
curl -sI http://localhost:3000/en-US
curl -sI http://localhost:3000/en-US/hello
```

## Expected

Per the i18n sub-path routing docs only `/`, `/fr/*`, `/nl-NL/*` should be reachable,
so `/en-US` and `/en-US/hello` should 308-redirect to `/` and `/hello`.

## Actual

Both return `200 OK` and render the page in dev and in production (`next build && next start`),
duplicating every page on two URLs.

## Bonus: the documented `redirects` workaround loops forever

`next.config.redirects.js` holds the `locale: false` redirect workaround from the issue.
Copy it over `next.config.js` and restart: every request, including `/hello` (no locale
prefix), answers `308 -> /hello` forever (ERR_TOO_MANY_REDIRECTS), because the source
`/en-US/:path*` also matches the locale-stripped default-locale path.
