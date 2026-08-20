# Repro: empty URL search params dropped by middleware rewrite on Vercel

Issue: https://github.com/vercel/next.js/issues/73722

## Run

```bash
npm install
npx vercel deploy --prod   # must run on Vercel; does NOT reproduce locally
curl "https://<deployment>/?foo="      # -> {}          (bug: expected {"foo":""})
curl "https://<deployment>/?a=&b=2"    # -> {"b":"2"}   (bug: expected {"a":"","b":"2"})
curl "https://<deployment>/?foo=bar"   # -> {"foo":"bar"} (ok)
```

Local control (correct behavior):

```bash
npx next build && npx next start
curl "http://localhost:3000/?a=&b=2"   # -> {"a":"","b":"2"}
```

Deleting `middleware.js` makes the deployed app behave correctly too.
