# Repro: next#86509 — individual `rotate`/`translate` dropped/merged into `transform`

`app/globals.css`:

```css
.element {
  rotate: 90deg;
  transform: skewY(7deg);
  translate: 0% 100%;
}
```

## Run

```bash
npm install
npm run build
find .next -name "*.css" -exec grep -o "\.element[^}]*}" {} \;
```

## Actual (next 16.0.3 and 16.3.1)

```css
.element{transform:skewY(7deg)translateY(100%)}
```

`rotate: 90deg` is dropped entirely and `translate` is folded into `transform`.

## Expected (next 15.5.4)

```css
.element{rotate:90deg;transform:skewY(7deg);translate:0 100%}
```
