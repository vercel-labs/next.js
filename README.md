# Repro: issue #76019 — catch-all inside parallel route receives whole pathname

Next.js 15.1.7 (also 15.5.23). Fixed in 16.3.1.

```
npm install
npm run dev
curl -s localhost:3000/top-level/baz/example   # {"segments":["example"]}  (correct)
curl -s localhost:3000/top-level/foo/var       # {"segments":["top-level","foo","var"]}  (bug, expected ["var"])
```

`app/top-level/foo/@parallel/[...segments]/page.tsx` is the parallel-slot catch-all.
