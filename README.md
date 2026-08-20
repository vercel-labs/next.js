# Repro: Next.js rewrite to `http://localhost:5328` fails on Vercel (issue #66550)

The reporter's linked repo (`arnaud0617/nextjs-boilerplate`) is not public, so this is a
minimal re-creation of the `vercel/examples` `python/nextjs-flask` setup described in the issue.

## Local (works)
```
npm install
pip install -r requirements.txt
python3 -m flask --app api/index run -p 5328 &
npm run dev
curl -i http://localhost:3000/api/hello   # 200 "Hello! This is Arnaud, from Flask"
```

## Vercel (fails)
Deploy this directory. `/` renders, but:
```
curl -i https://<deployment>/api/hello
# 404 NOT_FOUND, Code: DNS_HOSTNAME_RESOLVED_PRIVATE
```
Because `next.config.js` rewrites every `/api/*` request to `http://localhost:5328`, which on
Vercel resolves to a private address and is refused before the Python function is reached.

Fix: only apply the rewrite in development, e.g.
```js
rewrites: async () => process.env.NODE_ENV === 'development'
  ? [{ source: '/api/:path*', destination: 'http://127.0.0.1:5328/api/:path*' }]
  : []
```

## Observed (2026 run, next 14.2.3)
- local `next dev`: `GET /api/hello` -> 200 `Hello! This is Arnaud, from Flask`
- Vercel deployment: `GET /api/hello` -> 404 with header `x-vercel-error: DNS_HOSTNAME_RESOLVED_PRIVATE`
- Same app with the dev-only rewrite: `/api/index` is handled by the Flask Python function
  (Flask's own 404 page, `x-matched-path: /api/index`), i.e. the Python runtime is fine and the
  `localhost` rewrite is the sole cause.
