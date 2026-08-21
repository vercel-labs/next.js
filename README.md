# Repro: "Missing `<html>` and `<body>` tags in the root layout" points at the wrong file (#87208)

Common i18n setup: `<html>`/`<body>` live in `app/[locale]/layout.tsx` so `lang` can be
set per locale, and the root `app/layout.tsx` only forwards `children`.

Any route rendered **outside** `[locale]` (here `app/not-found.tsx`) therefore has no
`<html>`/`<body>`. In dev the overlay shows a generic runtime error blaming the *root
layout*, without naming `app/not-found.tsx`, so there is nothing to act on.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000/en/about  -> OK, <html lang="en">
# open http://localhost:3000/nope      -> Runtime Error: Missing <html> and <body> tags in the root layout.
# or click the "missing route" link on /en/about (client navigation) -> same overlay
```

`next build` succeeds with no warning about the offending route.

Next.js 16.3.1, Turbopack dev.
