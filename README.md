# Repro: next/script-loaded custom elements lose React event listeners and object props

Minimal reproduction for https://github.com/vercel/next.js/issues/84091 (Next.js 15.5.3, React 19.1.1).

`public/my-element.js` defines a trivial custom element `<my-select>` (property `menuList`,
custom event `my-change`), standing in for a CDN-hosted web component library.

```
npm install
npm run dev   # http://localhost:3222   (npm run build && npm start also reproduces)
```

Then click the "select" button on each route:

| Route | How the element is loaded | `onmy-change` listener | `menuList` object prop |
| --- | --- | --- | --- |
| `/next-script` | `<Script src="/my-element.js" />` (also with `strategy="beforeInteractive"`) | **not attached, no alert** | **not set (stays `[]`)** |
| `/plain-script` | plain `<script src="/my-element.js" />` | attached, alert fires | set as property |
| `/forced-rerender` | `next/script` + `useEffect(() => setState({}))` | attached after the forced re-render | wrongly stringified to the `menulist="[object Object]"` attribute |

`next/script` loads the definition after hydration, so React hydrates `<my-select>` as an
unknown element: no custom event listener is registered and the object prop is dropped.
