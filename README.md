# next/font/google: CJK fonts are missing their real subsets (vercel/next.js#53522)

`next/font/google` derives each font's subset list from the `/* subset */` comments in the
Google Fonts CSS (`packages/font/src/google/find-font-files-in-css.ts`). For CJK families
Google emits numeric comments (`/* [4] */`) or, today, no comments at all, so the bundled
`font-data.json` records only the incidental Latin/Cyrillic subsets.

## Reproduce

```bash
npm install
npm run check-font-data   # Noto Serif SC => ["cyrillic","latin","latin-ext","vietnamese"]
npm run build             # fails: TS2322 on subsets: ['chinese-simplified']
```

`https://fonts.googleapis.com/css2?family=Noto+Serif+SC&subset=chinese-simplified` returns
200 – the subset exists upstream, `next/font` just does not know about it.

## Observed with next@16.3.1-canary.25

- `npm run build` fails:
  `app/layout.tsx(9,13): error TS2322: Type '"chinese-simplified"' is not assignable to type '"cyrillic" | "latin" | "latin-ext" | "vietnamese"'.`
- Removing type checking (plain-JS layout) makes the build pass, but all 101 `@font-face`
  slices (3.3 MB) are downloaded into `.next/static/media` regardless of the requested subset,
  and no `<link rel="preload" as="font">` is emitted because the requested subset name never
  matches a CSS comment. With `subsets: ['latin']` exactly one font is preloaded.
