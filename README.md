# Reproduction: `next build` fails with ENOENT for `500.html` when using `output: "export"`

Upstream issue: https://github.com/vercel/next.js/issues/81980

## Run

```sh
npm install
npm run build
```

## Observed (next@15.5.23, also 15.4.3 / 15.5.4)

```
> Build error occurred
[Error: ENOENT: no such file or directory, rename '<root>/.next/export/500.html' -> '<root>/.next/server/pages/500.html']
```

Exit code 1. All static pages generate successfully (`✓ Generating static pages (4/4)`)
and the failure happens afterwards, while moving exported files into place.

## Expected

The build succeeds and `out/500.html` is emitted.

## Notes

* The only requirement is an App Router route named `500` plus `output: "export"`.
  Route groups, `[lang]` dynamic segments, `generateStaticParams()` and i18n from the
  original report are **not** needed.
* `app/404/page.tsx` builds fine — only `500` is affected.
* `trailingSlash` / `distDir` do not matter; the error path is hard-coded to `.next/`
  even when `distDir` is set to something else.
* Fixed in `next@16.0.0` (verified: 16.0.0 and 16.3.1 build this project successfully),
  but still broken on the latest 15.x (15.5.23).
