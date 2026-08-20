# Reproduction: `fetch` does not work when using manual suspense (vercel/next.js#67285)

A `"use client"` component that suspends manually (throws a promise) and calls
`fetch(`${window.location.origin}/multipliers.bin`)` inside the promise callback.
Because Client Components are still server-rendered, the callback runs in Node and
`window` is undefined.

## Run

```bash
npm install
npm run dev   # visit http://localhost:3000 -> server logs "ReferenceError: window is not defined"
npm run build # fails: Error occurred prerendering page "/" (window is not defined)
```

Verified with next@16.3.1 / react@19.2.0 (originally reported on next@14.2.4).

- `next dev`: terminal logs `⨯ ReferenceError: window is not defined` and the browser
  reports `Switched to client rendering because the server rendering errored`, then
  renders correctly on the client.
- `next build`: exits 1 with `Error occurred prerendering page "/"`.
