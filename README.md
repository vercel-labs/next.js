# Repro: Tailwind classes in `mdx-components.tsx` are not generated (docs gap, next.js#74487)

Next.js 15.1.3 + `@next/mdx` + Tailwind CSS v3 with the default `content` globs from
`create-next-app` (`./pages/**`, `./components/**`, `./app/**`).

`mdx-components.tsx` lives at the project root, so it matches none of those globs and
Tailwind never generates the utilities used inside it, even though the docs page
(`/docs/app/building-your-application/configuring/mdx#global-styles-and-components`)
shows exactly this pattern.

## Steps

```bash
npm install
npm run build
grep -o 'text-fuchsia-500' .next/static/css/*.css   # -> no match
npm start                                            # open http://localhost:3000/hello
```

`app/hello/page.mdx` renders through the `h1` override in `mdx-components.tsx`
(`className="text-6xl font-bold text-fuchsia-500"`).

- Broken (as committed): computed style is `color: rgb(5,150,105)` (inherited from
  `body`), `font-size: 16px`, `font-weight: 400`. Class attribute is present in the HTML,
  but no matching CSS rule exists.
- Fix: add `'./mdx-components.tsx'` to `content` in `tailwind.config.ts`, rebuild.
  Computed style becomes `color: rgb(217,70,239)`, `font-size: 60px`, `font-weight: 700`.

(Tailwind CSS v4 with `@import "tailwindcss"` auto-detects sources, so this only affects
v3-style `content` config — which is what create-next-app generated at the time.)
