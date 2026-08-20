# Repro: invalid tag (`<html>`) inside `next/head` — issue #20924

`pages/index.js` renders `<html lang="en" />` inside `next/head`.

## Run

```
npm install
npm run dev   # http://localhost:3000
node check.js # Playwright: dumps console messages + where <title> ended up
```

## Observed

- Next 16.3.1-canary.25: no `next-head-count is missing` error, `<title>` stays in `<head>`.
  Still no dev warning; the invalid `<html lang="en" data-next-head="">` element is emitted
  inside `<head>` in the SSR/SSG HTML (dropped by the HTML parser).
- Next 13.5.6 (`npm i next@13.5.6 react@18.2.0 react-dom@18.2.0`): reproduces the report —
  repeated `Warning: next-head-count is missing.` in the browser console and `<title>` parsed
  into `<body>` (`document.querySelectorAll('body title').length === 1`).
