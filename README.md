# Reproduction: vercel/next.js#57538

MDX page fails with `createContext only works in Client Components` (pointing at
`node_modules/@mdx-js/react/lib/index.js`) when `mdx-components.js|tsx` is not at the
project root (e.g. it is placed in `app/`, or missing entirely).

`@next/mdx` aliases `next-mdx-import-source-file` to
`['private-next-root-dir/src/mdx-components', 'private-next-root-dir/mdx-components', '@mdx-js/react']`,
so a missing root `mdx-components` file silently falls back to `@mdx-js/react`, which
calls `React.createContext` in a server component.

## Run

```bash
npm install
npm run dev
# then open http://localhost:3000/mdx
```

Expected: the MDX page renders (or a clear error saying root `mdx-components` is missing).
Actual: 500 + `createContext only works in Client Components.`

Adding `mdx-components.js` at the repo root fixes it (see `mdx-components.js.txt`).
