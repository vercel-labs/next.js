# Repro: Edge Runtime supports `Buffer` but docs omit it (vercel/next.js#86281)

Next.js 15.5.4, Pages Router.

```bash
npm install
npm run dev
curl -i http://localhost:3000/        # middleware (edge) headers
curl http://localhost:3000/api/edge   # edge API route
```

`middleware.js` and `pages/api/edge.js` (`runtime: 'edge'`) both use `Buffer.from(...)`,
`Buffer.isBuffer`, `Buffer.byteLength`. Both work in `next dev` and `next build && next start`.

Observed:

```
x-buffer-ctor-name: Buffer
x-buffer-isbuffer: true
x-nonce: ZmY2MWQ3ZDgtN2QzMS00NjUyLTk3ZTQtNmYwZjVkMWUyODhj

{"base64":"aGVsbG8gZWRnZQ==","nonce":"...","isBuffer":true,"byteLength":6,"ctorName":"Buffer"}
```

Docs (`docs/01-app/03-api-reference/07-edge.mdx`) do not list `Buffer` and state
"Native Node.js APIs **are not supported**", while the CSP nonce guide uses `Buffer`.
Support was added in vercel/next.js#47191.
