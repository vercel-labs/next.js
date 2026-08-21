# Repro: next/headers not printable via console.log (vercel/next.js#76981)

`console.log(await headers())` throws
`TypeError: Cannot read private member #headersList from an object whose class did not declare it`
because `HeadersAdapter` extends `Headers` but is returned wrapped in a Proxy, so undici's
`Headers[Symbol.for('nodejs.util.inspect.custom')]` runs with the wrong receiver.

Verified with next@16.3.1-canary.26, Node 24.17.0, in both `next dev` and `next build && next start`.

## Run

```
npm install
npm run dev   # then: curl http://localhost:3000/  -> 500
```
