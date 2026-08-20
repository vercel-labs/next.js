# Repro: NEXT_LOCALE cookie is ineffective with i18n domain routing (vercel/next.js#49339)

Docs claim the `NEXT_LOCALE` cookie can be used to override Accept-Language locale
detection. With `i18n.domains` (domain-based locale routing) that is not usable:

1. The cookie is per-origin, so a switcher on `example.co` cannot set it for `example.ca`.
2. Even when the cookie *is* present for the requested domain, Next.js still redirects
   across domains based purely on `Accept-Language`.

## Run

```bash
npm install
npm run dev            # or: npm run build && npm start
./repro.sh             # in another shell (PORT=3000 by default)
```

`repro.sh` sends requests with spoofed `Host`, `Accept-Language` and `Cookie` headers.

## Observed (Next.js 16.3.1, dev and production)

```
Host: example.ca  AL: <none>           cookie: <none>  -> 200
Host: example.ca  AL: en-US,en;q=0.9   cookie: <none>  -> 307 Location: https://example.co/
Host: example.ca  AL: en-US,en;q=0.9   cookie: en-CA   -> 307 Location: https://example.co/   <-- cookie ignored
Host: example.co  AL: en-CA,en;q=0.9   cookie: en-US   -> 307 Location: https://example.ca/   <-- cookie ignored
```

Expected: a `NEXT_LOCALE` cookie matching the requested domain's locale should suppress
the Accept-Language redirect (or the docs should state the cookie only works for
sub-path routing on a single domain).
