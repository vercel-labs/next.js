# Repro for vercel/next.js#70021 — SCSS `url()` fragment (`.svg#id`) stripped

`background: url('./sprite.svg#passport')` keeps the `#passport` fragment when written in
a plain `.css` file, but the fragment is removed when the identical rule is written in a
`.scss` file. SVG sprite fragments therefore never render.

## Run

```bash
npm install
npm run build   # then grep the emitted CSS
grep -o "sprite[^}]*}" .next/static/css/*.css
```

or `npm run dev` and open http://localhost:3000 — only the second box shows the sprite.
