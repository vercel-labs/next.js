# Repro: `notFound()` error shell serves `<html id="__next_error__">` with no `lang` attribute

Upstream issue: https://github.com/vercel/next.js/issues/97514

## Run

```bash
npm install
npm run build
npm start
curl -s -o /tmp/b.html -w "%{http_code}\n" http://localhost:3000/rp1452probe
grep -o '<html[^>]*>' /tmp/b.html
```

## Expected

`404` and `<html lang="de">` (the `lang` from the root layout / route locale).

## Actual

`404` and `<html id="__next_error__">` — no `lang` attribute in the streamed HTML,
even though the root layout declares `lang="de"` and `not-found.tsx` renders inside the body.

Reproduced on next@16.3.0 and next@16.3.1-canary.23.
