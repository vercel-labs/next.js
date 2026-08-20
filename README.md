# Repro: rewrites to a Django (APPEND_SLASH) backend cause an infinite redirect loop

Upstream issue: https://github.com/vercel/next.js/issues/68188

`django-like-backend.js` is a 30-line stand-in for a Django REST backend running with the
default `APPEND_SLASH = True`: any request whose path does not end in `/` gets a
`301` to the same path plus `/`.

Next.js is configured with a plain `rewrites()` proxy for `/api/:path*`.

## Run

```bash
npm install
node django-like-backend.js &     # "Django" on :8000
npm run dev                        # Next.js on :3000
curl -sS -L --max-redirs 6 -o /dev/null -D - http://127.0.0.1:3000/api/groups
```

## Observed

```
HTTP/1.1 301 Moved Permanently     <- backend APPEND_SLASH, proxied through the rewrite
location: /api/groups/
HTTP/1.1 308 Permanent Redirect    <- Next.js trailing-slash normalization
location: /api/groups
... repeats forever (curl: (47) Maximum (6) redirects followed)
```

The browser shows `ERR_TOO_MANY_REDIRECTS`.

Root cause: Next.js' `afterFiles` rewrite always proxies the path **without** the trailing
slash (`:path*` matching strips it), and Next.js' own trailing-slash redirect (308) undoes
the backend's `301`, so the two redirects ping-pong forever.

## Variants

* `FIX=slash npm run dev` — destination `.../api/:path*/` → `200 {"ok":true,"path":"/api/groups/"}`.
* `FIX=skip npm run dev` — `skipTrailingSlashRedirect: true` alone does **not** help; the
  rewrite still proxies `/api/groups` (no slash), so the backend 301s forever.

Reproduced with next 14.1.2 (version in the report) and next 16.3.1.
