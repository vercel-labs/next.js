# Repro: vercel/next.js#71859

Confusing error when calling a function prop (server-side closure) from a `"use cache"` scope.

## Run

```
npm install --legacy-peer-deps
npm run dev
# then open http://localhost:3000/?foo=bar
```

## Observed (next@16.3.1-canary.25)

HTTP 500 with:

```
[ Cache ] Error: Attempted to call a temporary Client Reference from the server but it is on the client.
It's not possible to invoke a client function from the server, it can only be rendered as a Component
or passed to props of a Client Component.
    at Parent (app/parent.js:7:8)
```

The wording mentions Client/server, but the actual boundary crossed is Server -> Cache.
