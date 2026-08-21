# next#86122 — `proxy.ts` in `output: "standalone"` (self-hosted / behind a CDN)

Minimal harness written while triaging
https://github.com/vercel/next.js/issues/86122
("`proxy.ts` does not execute in production when behind Cloudflare Proxy").

The reporter's linked repository (`shivaluma/report-bug-next16-proxy`, branch `main`)
contains **no `proxy.ts` file at all** — only `middleware.ts` exists, on the
`middleware` branch — and both demo hosts (`next16-proxy.shiro.fit`,
`next16-middleware.shiro.fit`) no longer resolve. This harness fills that gap
with the smallest app that matches the reported configuration
(`output: "standalone"`, root-level `proxy.ts`, matcher `/((?!_next/static|_next/image|favicon.ico|public).*)`).

## Run

```bash
npm install
bash verify.sh                      # Turbopack build (default)
BUILDER=--webpack bash verify.sh    # webpack build
VARIANT=middleware bash verify.sh   # middleware.ts control
```

`verify.sh` builds, copies static assets into `.next/standalone`, starts
`.next/standalone/server.js`, prints `functions-config-manifest.json`, the
standalone server listing, the response headers and the server log.

## Result observed (Next.js 16.0.3 and 16.3.1-canary.26, Node 24)

`proxy.ts` **does execute** in the standalone server with both builders:

```
HTTP/1.1 200 OK
set-cookie: isGuest=true; Path=/
...
PROXY RUNNING: /
```

`.next/standalone/.next/server/middleware.js` is emitted and
`functions-config-manifest.json` contains `"/_middleware": { "runtime": "nodejs", ... }` —
byte-identical to the `middleware.ts` control, whose output is also identical
(`MIDDLEWARE RUNNING: /` + the same `set-cookie` and `Cache-Control: s-maxage=31536000`
headers). So the framework/standalone output is not the differentiator; the
remaining variable in the report is the CDN/proxy layer, which cannot be
reproduced without the reporter's Cloudflare configuration and header dumps.

Note: `export const config = { runtime: "nodejs" }` inside `proxy.ts` is a hard
build error in 16.0.3 (`Route segment config is not allowed in Proxy file`), so a
literal `middleware.ts` → `proxy.ts` rename of the reporter's control file does not
even build; the `runtime` key must be dropped.
