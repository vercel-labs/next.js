# Reproduction: `examples/i18n-routing` (formerly `app-dir-i18n-routing`) ignores `defaultLocale` and drops the selected locale on navigation

Issue: https://github.com/vercel/next.js/issues/69735

This is `examples/i18n-routing` from next.js canary with three changes:

1. `i18n-config.ts`: `defaultLocale: "de"`.
2. New `app/[lang]/johnny/page.tsx`.
3. New `app/[lang]/components/navigation.tsx` with locale-less `<Link href="/">` / `<Link href="/johnny">`, rendered on both pages.

## Run

```bash
npm install
npm run dev
```

## Issue 1 - `defaultLocale` is ignored

```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:3000/
# 307 http://localhost:3000/en/   <- expected /de/
```

Even with **no** `Accept-Language` header, `middleware.ts` redirects to `/en`
(`@formatjs/intl-localematcher` matches `*` against the first entry of `i18n.locales`),
so `defaultLocale` never takes effect.

## Issue 2 - selected locale is not preserved

1. Open `http://localhost:3000/de` (or switch locale to `de` with the locale switcher).
2. Click `johnny` in the nav.
3. URL becomes `http://localhost:3000/en/johnny` and the page renders `Current locale: en`.

Locale-less internal links go back through the middleware, which resolves the locale
from `Accept-Language` only; the currently active locale in the URL is discarded.
