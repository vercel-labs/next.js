# next.js#70841 — `ts(2614)` on `import { frontmatter } from "*.mdx"`

Reproduces the editor-only TypeScript error reported in
https://github.com/vercel/next.js/issues/70841:

```
Module '"@/content/post.mdx"' has no exported member 'frontmatter'.
Did you mean to use 'import frontmatter from "@/content/post.mdx"' instead? ts(2614)
```

`tsserver-probe.mjs` drives the real TypeScript language server (the same thing that
powers VS Code) against `src/app/page.tsx`, prints its semantic diagnostics, then makes
five edits to the file and prints diagnostics again — so the "error comes back when I
change something in the file" part is visible in CI/CLI output.

The MDX TypeScript plugin (`@mdx-js/typescript-plugin`, which the
`unifiedjs.vscode-mdx` VS Code extension bundles) is enabled in `tsconfig.json`.

## Run

```bash
npm install
npx tsc --noEmit         # passes: 0 errors (declare module "*.mdx" is honoured)
npm run probe            # language server reports ts(2614) on open and after every edit
npm run dev              # runtime is fine: frontmatter is { title: 'Hello world' }
```

## Result

* `tsc --noEmit` → no errors.
* language server → `2614: Module '"@/content/post.mdx"' has no exported member 'frontmatter'...`
  on open and after each of the 5 edits.

## Cause / workaround

The MDX language tooling resolves `*.mdx` as a *real* module, which shadows the
`declare module "*.mdx"` ambient declaration. It does not know about
`remark-mdx-frontmatter`, so the module only has a default export → `ts(2614)`.

Telling the MDX plugin about the remark plugins removes the error (verified with this
same probe):

```jsonc
// tsconfig.json
"mdx": { "plugins": ["remark-frontmatter", "remark-mdx-frontmatter"] }
```

Nothing in `@next/mdx` / `next dev` is involved in the diagnostic.
