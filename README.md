# Repro: `router.asPath` includes hash fragment on the client (vercel/next.js#25202)

Pages Router. `useRouter().asPath` omits the hash during SSR (hash is never sent to the server)
but includes it on the client, so client/server values differ for the same URL.

```
npm install
npm run dev   # then open http://localhost:3000/#my-subheading
```

Observed with next 16.3.1 (dev and `next build && next start`):

- server HTML: `asPath` = `/`, `<p id="mismatch-demo" class="no-hash">`
- client after hydration: `asPath` = `/#my-subheading`, `class="with-hash"`
