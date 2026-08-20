# Reproduction for vercel/next.js#38877 — duplicate meta tags in `<head>`

Minimal pages-router app that simulates a GTM-like third-party script inserting a
`<script>` into `<head>` right before the `<meta name="next-head-count">` marker,
which is what breaks the legacy head-count bookkeeping.

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start &
npm run check            # prints <head> meta/title tags after hydration and after a client nav
```

## Result on next@canary (16.3.1-canary.25): no duplicates

```
<meta charset="utf-8" data-next-head="">
<meta name="viewport" content="width=device-width, initial-scale=1" data-next-head="">
<title data-next-head="">Page A</title>
<meta name="description" content="desc A" data-next-head="">
```

## Result on the originally reported version

```bash
npm i next@12.2.2 react@17.0.2 react-dom@17.0.2
npm run build && npm start & npm run check
```

```
<meta charset="utf-8">
<title>Page A</title>
<meta name="description" content="desc A">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="utf-8">          <-- duplicated
<meta name="next-head-count" content="4">
```

Modern Next.js marks its own head tags with `data-next-head` instead of counting
siblings from `next-head-count`, so third-party head insertions no longer cause
duplication.
