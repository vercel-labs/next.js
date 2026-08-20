# Repro: intercepting route not intercepted when deployed on Vercel (issue #74895)

Minimal reproduction of https://github.com/vercel/next.js/issues/74895

## Layout
- `/ri/home`, `/ri/payment`, `/ri/progress`
- `/ri/payment/@modal/(..)progress/page.jsx` intercepts `/ri/progress` when navigating from `/ri/payment`

## Steps
```
npm install
npm run build && npm start        # http://localhost:3000
node check.mjs http://localhost:3000 local B,A,B   # needs `npm i playwright`
```
Then deploy the same directory to Vercel and run the same script against the deployment URL.

Scenario A = Home -> Progress (expect full page). Scenario B = Home -> Payment -> Progress (expect modal).

## Result
| target | scenario A | scenario B |
| --- | --- | --- |
| `next start` (local) | full page (correct) | **modal (correct)** |
| Vercel deployment | full page (correct) | **full page (BUG, modal expected)** |

## Evidence / cause
On Vercel the prefetch RSC response for a prerendered route is missing `next-url` in `Vary`:

```
# vercel
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
# next start
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, next-url, Accept-Encoding
```

`fetch-server-response.js` derives `couldBeIntercepted` from `vary.includes('Next-URL')`, and
`prefetch-cache-utils.js` only includes `nextUrl` in the prefetch cache key when `couldBeIntercepted`.
So on Vercel the prefetch made from `/ri/home` (non-intercepted, full page) is cached under a
nextUrl-less key and reused when navigating from `/ri/payment`, so the interception never happens.
Repro of the origin behaviour with curl:

```
curl -sD- -o- "$URL/ri/progress" -H 'RSC: 1' -H 'Next-Router-Prefetch: 1' -H 'Next-URL: /ri/payment'
```
returns the intercepted payload on both targets, i.e. the origin is fine; only the `Vary` header differs.
