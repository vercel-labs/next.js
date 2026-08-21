# Reproduction for vercel/next.js#74134

`adjustFontFallback: false` on a `next/font/google` font is ignored when the app is
compiled with **Turbopack**. The webpack pipeline honours it.

## Run

```bash
npm install

# Run one at a time (both share .next)
# BUG: Turbopack
npm run dev:turbopack   # http://localhost:3000

# OK: webpack
npm run dev:webpack     # http://localhost:3001
```

Open the page and look at the emitted font CSS chunk / the computed `font-family` of `<body>`.

## Observed

Turbopack (`next dev --turbopack`), Next.js 15.1.1-canary.1 and 16.3.1-canary.25:

```css
@font-face {
  font-family: Inter Fallback;
  src: local(Arial);
  ascent-override: 90.44%;
  descent-override: 22.52%;
  line-gap-override: 0.0%;
  size-adjust: 107.12%;
}
.inter_...__className { font-family: Inter, Inter Fallback; font-style: normal; }
```

webpack (`next dev --webpack`), same code:

```css
.__className_214d7f { font-family: 'Inter'; font-style: normal }
```

No `Inter Fallback` @font-face is emitted, matching the documented behaviour and Next.js 14.

## Root cause pointer

`crates/next-core/src/next_font/google/request.rs` declares

```rust
#[derive(Clone, Debug, Default, Deserialize)]
pub(super) struct NextFontRequestArguments {
    ...
    pub adjust_font_fallback: Option<bool>,
```

without `#[serde(rename_all = "camelCase")]`, so the `adjustFontFallback` key produced by the
next/font SWC transform never deserializes and
`options.rs` falls back to `adjust_font_fallback: argument.adjust_font_fallback.unwrap_or(true)`.

Confirmed empirically: writing `adjust_font_fallback: false` (snake_case) in the JS call *does*
drop the metric overrides under Turbopack, while `adjustFontFallback: false` does not. Note that
even with the key parsed, Turbopack still emits the `<Font> Fallback` family (`src: local(Arial)`)
and appends it to `font-family`, whereas webpack omits the fallback entirely.

Verified computed `getComputedStyle(document.body).fontFamily`:
`Inter, "Inter Fallback"` (Turbopack) vs `Inter` (webpack).
