# Repro: next/link drops trailing slash for paths containing a dot (vercel/next.js#56090)

With `trailingSlash: true` and `output: 'export'`, a route whose last segment contains a
dot (e.g. `/b.git/`) is treated as a "file" by `removeTrailingSlash` heuristics in
`packages/next/src/client/normalize-trailing-slash.ts`, so `next/link` renders
`href="/b.git"` even though the export only contains `out/b.git/index.html`.

## Run

```bash
npm install
npm run build
grep -o '<a href="[^"]*"' out/index.html
# => <a href="/a/"  and  <a href="/b.git"   (expected: "/b.git/")

npm run serve   # static host that does not redirect
curl -o /dev/null -w '%{http_code}\n' http://localhost:3999/b.git   # 404
curl -o /dev/null -w '%{http_code}\n' http://localhost:3999/b.git/  # 200
```

App Router is affected the same way (`<Link href="/b.git/">` renders `href="/b.git"`).
