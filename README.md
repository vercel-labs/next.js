# Repro: next/font preload links missing in `next dev` (vercel/next.js#62332)

Minimal App Router app using `next/font/google` (Inter) and `next/font/local`
(a local `.woff2`), both with `preload: true` (default).

## Steps

```bash
npm install

# 1) production: preload links ARE present (expected)
npm run build
npm run start &
npm run check           # exits 0, prints 2 `as="font"` preload links

# 2) dev with Turbopack (default) : preload links are MISSING
npm run dev &
npm run check           # exits 1, prints 0 `as="font"` preload links

# 3) dev with webpack: preload links are MISSING as well
npm run dev:webpack &
npm run check           # exits 1
```

`check.mjs` just fetches the initial HTML of `http://localhost:3000` and counts
`<link rel="preload" ... as="font">` tags.

## Result (Next.js 16.3.1, Node 24, Linux)

| mode                     | `as="font"` preloads in initial HTML |
| ------------------------ | ------------------------------------ |
| `next build` + `next start` | 2 (ok)                            |
| `next dev` (Turbopack)   | 0 (bug)                              |
| `next dev --webpack`     | 0 (bug)                              |

With Next.js 14.1.0 the same app emits the two font preload links in `next dev`
as well, so dev-mode preloading regressed after 14.x (still 0 on 15.5.23 and
16.3.1).
