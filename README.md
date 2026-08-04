# Repro: notFound() on ISR/dynamic-params routes writes permanent files to `.next/server/app`

Issue: https://github.com/vercel/next.js/issues/96581 (Next.js 16.2.11)

## Run

```bash
npm install
npm run build
npm start
# each distinct 404 path writes html/meta/rsc/segments files to disk
for i in $(seq 1 200); do curl -s -o /dev/null "http://localhost:3000/on-demand/foo/bot$i"; done
du -sh .next/server/app/on-demand
find .next/server/app/on-demand -name '*.html' | wc -l
# revalidating a not-found path does not remove the files
curl "http://localhost:3000/api/revalidate?path=/on-demand/foo"
ls -la .next/server/app/on-demand/foo.html
```

`/on-demand/[...segments]` has `generateStaticParams()` returning `[]` and `dynamicParams = true`;
any path starting with `foo` calls `notFound()`. Each such request is still persisted to the
file-system cache and the files are never removed.
