# Turbopack ignores webpack magic comments (`webpackExclude`) in dynamic imports

Repro for https://github.com/vercel/next.js/issues/71934

`app/blog/[slug]/page.js` does a dynamic import with a fully dynamic path and a
`/* webpackExclude: /\.(mp4|js)$/ */` magic comment. The `content/post-a/` folder
contains sibling files that must be excluded from the generated context:

- `video.mp4` (no loader registered)
- `broken.js` (intentionally invalid JavaScript)

## Run

```bash
npm install
npm run build          # Turbopack -> FAILS
npm run build:webpack  # webpack   -> succeeds
npm run dev            # Turbopack -> /blog/post-a returns 500
```

## Result

webpack honors the magic comment and builds/prerenders `/blog/post-a`.
Turbopack ignores it and pulls every file of `content/` into the context module:

```
Error: Turbopack build failed with 2 errors:
./content/post-a/video.mp4
Error: Unknown module type
./content/post-a/broken.js:1:6
Error: Expected ';', '}' or <eof>
```

Note: if the dynamic segment is followed by a static suffix (e.g.
`` `../../../content/${slug}/index.mdx` ``) Turbopack narrows the context itself and the
problem is hidden; the magic comment is only needed when the path is fully dynamic.
