# Repro: vercel/next.js#49857

Pages Router API routes only JSON-parse `req.body` for the exact content types
`application/json` and `application/ld+json`, so structured-suffix media types
like `application/vnd.contentful.management.v1+json` (Contentful webhooks) leave
`req.body` as a raw string.

## Run

```bash
npm install
npm run dev
# expect bodyType "object" for all three, actual: "string" for the vendor +json type
curl -s -XPOST localhost:3000/api/echo -H 'content-type: application/json' -d '{"a":1}'
curl -s -XPOST localhost:3000/api/echo -H 'content-type: application/ld+json' -d '{"a":1}'
curl -s -XPOST localhost:3000/api/echo -H 'content-type: application/vnd.contentful.management.v1+json' -d '{"a":1}'
# App Router route handler parses it fine:
curl -s -XPOST localhost:3000/api/echoapp -H 'content-type: application/vnd.contentful.management.v1+json' -d '{"a":1}'
```

Source: `next/dist/server/api-utils/node/parse-body.js` ->
`if (type === 'application/json' || type === 'application/ld+json')`
