# Repro: vercel/next.js#65560 — `output: 'export'` silently drops SSG pages of a dynamic route

Next.js 14.2.3 (also reproduces on next@canary 16.3.1-canary.25).

## Run

```bash
npm install
npm run build
ls out/blog          # ENOENT: no pages were exported
```

## Observed

`next build` exits 0 and reports the params as prerendered:

```
└ ● /blog/[slug]
    ├ /blog/a
    └ /blog/b
```

but `out/` only contains `index.html`, `404.html`, `404/index.html` — no
`out/blog/a/index.html` / `out/blog/b/index.html`, and the page component is
never rendered for `slug: 'a' | 'b'` (no `PAGE RENDER with params:` log).

## Root cause observed in the 14.2.3 build pipeline

* `build/index.js`: `hasDynamicData = appConfig.revalidate === 0 || ...` -> the
  route is omitted from `prerender-manifest.json` (`dynamicRoutes` and `routes`
  are both empty for it).
* `export/index.js` (final `writeFullyStaticExport` pass, `buildExport: false`)
  then adds every app page route missing from the prerender manifest to the
  export path map **verbatim**, so it exports `/blog/[slug]` itself. Instrumented
  output of that pass:

  ```
  DEBUG filteredPaths ["/404","/_not-found","/blog/[slug]","/404.html"]
  DEBUG result for /blog/[slug] {"files":[],"revalidate":0}
  ```

  That is where the `params.slug === '%5Bslug%5D'` reported in the issue comes
  from: the encoded literal segment is passed to the page as the param.
* `export/routes/app-page.js` returns `{ revalidate: 0 }` without writing files
  and without an error, so the pages disappear from `out/` silently.

## Expected

Either the pages are exported, or `next build` fails with an actionable error
instead of exiting 0 while `out/` is missing the routes it just listed.
