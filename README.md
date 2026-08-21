# Repro: `headers().get('cookie')` is percent-encoded after middleware/proxy mutates `request.cookies` (vercel/next.js#76794)

## Run
```
npm install
npm run dev
curl -H 'Cookie: user_name=John/Doe' http://localhost:3000/
```
(or open http://localhost:3000/ in a browser)

## Expected
`headers().get('cookie')` === `user_name=John/Doe` (the raw incoming header)

## Actual
`headers().get('cookie')` === `user_name=John%2FDoe; mw=1`
while `cookies().getAll()` still returns the decoded `John/Doe`.

Trigger: `proxy.js` (`middleware.js` on Next 15) calls `request.cookies.set(...)`, which
re-serializes the whole `cookie` request header through `encodeURIComponent`
(`RequestCookies`/`@edge-runtime/cookies` serialization), so every pre-existing cookie value
seen by `headers()` downstream is now encoded.

Reproduced on next@16.3.1-canary.26 and next@15.2.2 (with `middleware.js`).
