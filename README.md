# Reproduction: vercel/next.js#66739

App crashes with `NotFoundError: Failed to execute 'removeChild' on 'Node'` after the page
is translated (Google Translate) and a dropdown / conditional text node is toggled.

The reporter's link (a GitHub profile) contained no reproduction, so this minimal one was created.
`fakeGoogleTranslate()` in `app/page.js` performs exactly the DOM rewrite the Google Translate
widget performs: bare text nodes are replaced with `<font>` elements. React keeps a reference to
the original text node, so the next reconciliation of that node throws and the tree unmounts.

## Run

```bash
npm install
npm run build && npm run start   # or: npm run dev
```

Open http://localhost:3000, click "1. Translate page", then "2. Toggle dropdown".

Observed: uncaught `NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be
removed is not a child of this node.` and the page goes blank. Toggling without the translate
step works fine.
