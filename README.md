# Repro: issue #91942 — `Content-Type: text/x-component` lacks `charset=utf-8`

Minimal App Router app with one Server Action returning a non-ASCII string.

```bash
npm install
npm run build && npm start   # http://localhost:3001
# grab the action id from the client chunk and POST it:
ID=$(grep -rhoE '"[0-9a-f]{40,}"' .next/static/chunks | tr -d '"' | sort -u | head -1)
curl -si -X POST http://localhost:3001/ -H "Next-Action: $ID" \
  -H 'Content-Type: text/plain;charset=UTF-8' --data '[]' | grep -i content-type
```

Observed (Next.js 16.1.5, dev and `next start`):

```
Content-Type: text/x-component
```

The body is UTF-8 encoded (`h c3 a9 l l o` for `héllo`), but no charset is
declared, while HTML document responses send `text/html; charset=utf-8`.
The same missing charset applies to RSC navigation payloads (`GET /` with `RSC: 1`).
