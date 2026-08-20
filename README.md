# Repro: vercel/next.js#35983 — query string order changed (repeated keys grouped)

Next.js re-serializes the request query string from a parsed object, so repeated
query keys are grouped together and the original order is lost. This breaks
signature verification over the raw query string.

## Run

```
npm install
npm run build
npm start
curl -s 'http://localhost:3000/api/dup?b=1&a=2&b=3&c=4'
curl -s 'http://localhost:3000/api/route-handler?b=1&a=2&b=3&c=4'
```

Request:  `?b=1&a=2&b=3&c=4`
`req.url` / `request.url`: `?b=1&b=3&a=2&c=4`  <-- reordered

Distinct (non-repeated) keys keep their order on current canary
(`/api/test?hmac=1&host=2&sell=3&t=4` is unchanged), both locally and on Vercel.
