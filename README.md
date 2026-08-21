# Repro: async root layout wrapped in Suspense breaks error/notFound rendering (#76778)

Next.js issue: https://github.com/vercel/next.js/issues/76778

## Run

```bash
npm install
npm run dev
# then
curl -s localhost:3000/ok  | grep -c NEXT_MISSING_ROOT_TAGS   # 0 (works)
curl -s localhost:3000/    | grep -c NEXT_MISSING_ROOT_TAGS   # 1 (page throws)
curl -s localhost:3000/nf  | grep -c NEXT_MISSING_ROOT_TAGS   # 1 (notFound())
```

## Expected

The root layout (`<html>`/`<body>`) is rendered around the error / 404 UI, the
same as when the root layout is not wrapped in `Suspense`.

## Actual

The streamed document has no top-level `<html>`/`<body>`; Next reports
`NEXT_MISSING_ROOT_TAGS` — "Missing <html> and <body> tags in the root layout."
(in Next 15 dev: `self.__next_root_layout_missing_tags=["html","body"]` and the
overlay error "The following tags are missing in the Root Layout: <html>, <body>").

Removing the `Suspense` wrapper in `app/layout.js` (keeping the layout `async`)
makes all three routes render without the missing-tags error, which isolates the
`Suspense` boundary around the root layout as the trigger.

Reproduced with next@16.3.1-canary.26 (react 19.2.8) and next@15.2.2-canary.0
(`experimental.dynamicIO`), `next dev`.
