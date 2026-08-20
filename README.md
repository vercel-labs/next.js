# Reproduction — issue #67950: `with-next-translate` example is broken (404s on every locale route)

Files are a verbatim copy of `examples/with-next-translate` from `vercel/next.js@canary`
(only `package.json` was changed: `next@canary`, React 19, `dev` uses `--webpack`, plus `playwright` for the screenshot script).

## Run

```bash
npm install --legacy-peer-deps
npm run dev        # next dev --webpack
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:3000/      # 404
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:3000/en    # 404
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:3000/ca    # 404
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:3000/en-US # 200
```

Optional screenshots: `npx playwright install chromium && node shot.mjs`.

## Observed (Next.js 16.3.1-canary.25)

1. `npm run dev:turbopack` (i.e. plain `next dev`, the default in Next 16) fails to boot:
   `ERROR: This build is using Turbopack, with a 'webpack' config and no 'turbopack' config.`
   `next-translate-plugin` injects a webpack config, so the example does not start at all with defaults.
2. With `--webpack` the server starts but logs
   `⚠ i18n configuration in next.config.js is unsupported in App Router.`
   `next-translate-plugin` writes `i18n: { locales: ['en','ca','ar','he'], defaultLocale: 'en' }` into the
   resolved config. Next strips those locale prefixes, so `/en`, `/ca`, `/ar`, `/he` never reach
   `app/[lang]/page.js` → 404. `/` is 404 too because the example has no `app/page.js`.
   Only a non-configured segment such as `/en-US` matches `[lang]` and renders (with default `en` messages),
   and every in-page link (`/en`, `/ca`, …) 404s.
3. The original "Missing required html tags" part of the report no longer reproduces: the example layout
   stopped being `async` in commit 2865e18 (PR #52653, Aug 2024). The routing breakage remains.
