# Repro: vercel/next.js#56511 - `blurwidth` / `blurheight` on `<img>`

```bash
npm install
npm run dev            # http://localhost:3000
npx playwright install chromium
npm run check          # prints img attributes + React warnings
```

`pages/index.tsx` renders three cases from one statically imported PNG:

- `<Image src={img} />` and `<Image src={img} placeholder="blur" />` -> **no** `blurwidth`/`blurheight`
  in the DOM (verified on next@16.3.1-canary.25, 13.5.4 and 12.3.4).
- `<img {...img} />` (spreading `StaticImageData`, as the documented import shape suggests) ->
  DOM gets `blurwidth="8" blurheight="8" blurdataurl="data:image/png;base64,..."` and React logs
  "React does not recognize the `blurWidth` prop on a DOM element".

The `<pre>` on the page shows the imported object still contains `blurWidth`, `blurHeight`,
`blurDataURL`, which is the source of the unsupported attributes.
