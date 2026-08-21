# Repro: next.js#94041 — route handler `sitemap.xml` under dynamic segments breaks adapter build

Repaired/minimized from the reporter's repo (https://github.com/jordihm9/nextjs-repro-94024),
which only failed when deployed on Vercel. The failure is **not** a parallel-worker race: it
happens in the *build adapter* (`onBuildComplete`) stage, which Vercel enables. Setting
`adapterPath` in `next.config.ts` reproduces it locally with a single worker.

Route tree:

```
app/(store-lang)/[store]/[lang]/(listing)/c/[slug]/page.tsx      dynamic = "force-static"
app/(store-lang)/[store]/[lang]/(listing)/c/sitemap.xml/route.ts dynamic = "force-static"
```

## Run

```bash
npm install        # next@16.2.6
npm run build
```

### next 16.2.6 (fails, exit 1)

```
{ appOutputs: [ '/_not-found', '/_global-error', '/[store]/[lang]/c/[slug]' ], pageOutputs: [] }
Error: Invariant: failed to find source route /[store]/[lang]/c/sitemap.xml for prerender /[store]/[lang]/c/sitemap.xml
```

thrown from `next/dist/build/adapter/build-complete.js` (`getParentOutput`): the app route
`/[store]/[lang]/c/sitemap.xml` never gets an entry in `appOutputMap`.

### next canary (16.3.1-canary.26) — build passes, output still wrong

```bash
npm install next@canary react@latest react-dom@latest
npm run build
```

The invariant no longer throws, but the route handler is emitted as a *literal static file*
with the dynamic segments replaced by `-`, and is absent from the adapter's `appRoutes`:

```
[adapter] staticFiles: [ ... {"p":"/-/-/c/sitemap.xml","t":"STATIC_FILE"} ]
[adapter] appRoutes:   (no /[store]/[lang]/c/sitemap.xml entry)
prerender-manifest routes: ['/_global-error', '/_not-found', '/-/-/c/sitemap.xml']
```

Narrowing (verified on 16.2.6 with this repro):

* Renaming `sitemap.xml/` -> `asd.xml/` builds fine and registers `/[store]/[lang]/c/asd.xml`.
* Deleting the sibling `[slug]/page.tsx` does **not** help: the build still throws the same
  invariant. So the trigger is the `sitemap.xml` metadata-route name under dynamic parent
  segments, not the sibling dynamic route.
