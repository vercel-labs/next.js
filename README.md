# Repro: ChunkLoadError for app-router chunks whose path contains `[` or `@` (vercel/next.js#62479)

Next.js (webpack builds) emits client chunks whose **filenames contain the raw route
folder names**, e.g.

```
.next/static/chunks/app/[lang]/page-3e6e75448a1d0beb.js
.next/static/chunks/app/[lang]/@modal/default-d0df94d6bad7c341.js
```

The HTML/manifest references them percent-encoded (`%5Blang%5D`, `%40modal`).
`next start`'s static handler only matches that **exact** spelling:

| request path | status |
| --- | --- |
| `/_next/static/chunks/app/%5Blang%5D/page-<hash>.js` | **200** |
| `/_next/static/chunks/app/%5blang%5d/page-<hash>.js` (lower-case hex) | **404** |
| `/_next/static/chunks/app/%5Blang%5D/@modal/default-<hash>.js` (decoded `@`) | **404** |

Per RFC 3986 §6.2.2.1 the hex digits of a percent-encoding are case-insensitive, and `@`
is a valid unreserved-in-path character, so all three should resolve to the same file.
Reverse proxies (nginx, Apache, Google App Engine, various PaaS front-ends) routinely
normalise escape sequences that way, so in production the chunk 404s and the browser
throws `ChunkLoadError` — the page renders but is never hydrated, so buttons do nothing.
Dev mode is unaffected.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start                 # :3010  plain next start
npm run proxy:lowercase   # :3011  proxy that lower-cases %5B -> %5b (nginx-like)
npm run proxy:decode-at   # :3012  proxy that decodes %40 -> @
npm run verify            # playwright: loads :3010/:3011/:3012 and reports errors
```

`npm run verify` output (Next 15.5.23):

```
=== direct-next-start http://localhost:3010/en        errors: none, button works
=== proxy-lowercase   http://localhost:3011/en
    404 /_next/static/chunks/app/%5Blang%5D/page-3e6e75448a1d0beb.js
    ChunkLoadError: Loading chunk 911 failed.
=== proxy-decoded-at  http://localhost:3012/en
    404 /_next/static/chunks/app/%5Blang%5D/%40modal/default-d0df94d6bad7c341.js
    ChunkLoadError: Loading chunk 723 failed.
```

You can also see it without any proxy:

```bash
curl -sI localhost:3010/_next/static/chunks/app/%5Blang%5D/page-<hash>.js | head -1  # 200
curl -sI localhost:3010/_next/static/chunks/app/%5blang%5d/page-<hash>.js | head -1  # 404
```

## Notes

* Reproduced with `next@15.5.23` and with `next@16.3.1 build --webpack`.
* `next@16` default (Turbopack) build names chunks by hash (`chunks/3l04zcqx63h3y.js`),
  so it is not affected — the bug is specific to webpack's path-derived chunk names
  combined with the static-file handler's exact-string matching.
