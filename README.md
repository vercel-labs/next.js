# Repro: middleware `NextResponse.rewrite()` to an external host loses `x-forwarded-host` on Vercel

Issue: https://github.com/vercel/next.js/issues/67469

Two minimal Next.js 16.3.1 apps:

- `mw/` – has `middleware.js` doing `NextResponse.rewrite(new URL(searchParams.rewrite), { request })`
- `target/` – prints/returns the request headers it receives (`/` page and `/api/echo` route handler)

## Run self-hosted (expected behavior)

```bash
cd target && npm install && npm run build && npx next start -p 3001 &
cd mw     && npm install && npm run build && npx next start -p 3000 &
curl -s "http://localhost:3000/?rewrite=http://127.0.0.1:3001/api/echo"
```

Result (correct):
```json
{"host":"127.0.0.1:3001","x-forwarded-host":"localhost:3000"}
```

## Run on Vercel (bug)

Deploy both directories as separate Vercel projects, then:

```bash
curl -s "https://<mw-deployment>/?rewrite=https://<target-deployment>/api/echo"
```

Result (incorrect – `x-forwarded-host` is rewritten to the target host, original host is lost):
```json
{"host":"<target-deployment>","x-forwarded-host":"<target-deployment>"}
```

Observed on Vercel with Next.js 16.3.1 (2026-08-20). The `forwarded` header shows the target host too.
