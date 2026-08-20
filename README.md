# Reproduction: `GoogleMapsEmbed` width/height reject percentages (vercel/next.js#64831)

The docs example passes `width="100%"`, but `@next/third-parties` appends `px`
unconditionally, producing the invalid CSS declaration `width:100%px`.

## Run

```bash
npm install
npm run dev
# then:
curl -s http://localhost:3000/ | grep -o 'style="[^"]*"'
```

## Observed (next 16.3.1 / @next/third-parties 16.3.1)

```
style="height:200px;width:100%px"
```

`getComputedStyle(el).width` therefore falls back to `auto` — the percentage is dropped.

Source: `packages/third-parties/src/ThirdPartyScriptEmbed.tsx`
(`height != null ? \`${height}px\` : 'auto'`, same for width).
