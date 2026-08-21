# Repro: `@next/next/no-page-custom-font` fires for App Router files (issue #80963)

The rule computes `context.filename.split('pages')` and bails only when the last
segment is empty. For any file whose path contains no `pages` segment (e.g. an
App Router `src/app/layout.tsx`, or a monorepo `packages/web/src/app/layout.tsx`),
`page` is the whole path, so the rule keeps running and reports the
pages-router-only message.

## Run

```bash
npm install
npm run lint
```

## Expected

No warning for App Router files (`src/app/layout.tsx`) — `pages/_document.js`
does not exist in the App Router.

## Actual

```
src/app/layout.tsx
  9:9  warning  Custom fonts not added in `pages/_document.js` will only load for a single page. ...
src/components/Fonts.tsx
  3:5  warning  Custom fonts not added in `pages/_document.js` will only load for a single page. ...
```

`pages/_document.tsx` (the correct pages-router usage) is not reported, as expected.
