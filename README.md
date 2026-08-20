# Repro: global 404 (`app/not-found.tsx`) is not usable with i18n root layout (`app/[lang]/layout.tsx`)

Issue: https://github.com/vercel/next.js/issues/50699
Tested with `next@16.3.1-canary.24`, react 19.2.8.

## Run

```bash
pnpm install
pnpm build && pnpm start   # then open http://localhost:3000/en/abc
pnpm dev                   # then open http://localhost:3000/en/abc
```

## Observed (canary)

- `pnpm dev`: dev overlay error `Missing <html> and <body> tags in the root layout.` on any 404 URL.
- `pnpm build && pnpm start`: `/en/abc` returns 404 with an HTML body that has **no `<!DOCTYPE html>`, no `<html>` and no `<body>`** (the real root layout lives in `app/[lang]/layout.tsx`, and the required top-level `app/layout.tsx` can only render `<>{children}</>`), so the browser renders the 404 in quirks mode (`document.compatMode === "BackCompat"`).
- The 404 renders outside `app/[lang]/layout.tsx`, so it cannot be localized or share the locale layout.
- The 2023 report of "content blinks then page goes blank" no longer happens on current canary: the 404 text stays visible.

## Workaround / maintainer suggestion verified

`experimental.globalNotFound: true` + `app/global-not-found.tsx` returning `<html><body>…</body></html>`
produces a valid doctype'd document (`CSS1Compat`) and can be localized, e.g. from `accept-language`
via `next/headers` — but that makes `/_not-found` dynamic (`ƒ`) and the URL locale segment is still
unavailable to it.
