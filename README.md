# Repro: Next 16 CSS Modules `:global()` pseudo-element selectors stripped (vercel/next.js#85332)

```bash
npm install
npm run build
cat .next/static/chunks/*.css
```

Next 16.0.0 emits:

```css
:is(.page-module__X__main input::-webkit-outer-spin-button,.page-module__X__main input::-webkit-inner-spin-button){appearance:none}
```

Chromium treats `::-webkit-*-spin-button` inside `:is()` as invalid and drops the whole
rule, so the number input keeps its spin buttons. Next 15.5.6 (webpack/lightningcss with a
lower browser target) emits the plain comma-separated selector and the rule applies.

Affects both `next dev` and `next build && next start`.
