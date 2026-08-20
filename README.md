# Repro harness for vercel/next.js#67736 — "Suspense not working in a nested route"

The reporter's linked app (HermesThemes/ArtDungeon) cannot be run: it needs a Postgres
database + secrets, and the route mentioned in the issue (`/post/[id]`) does not exist
(the app has `app/arts/[id]/page.js`).

This minimal harness isolates the claim. Four routes:

| route | pattern |
| --- | --- |
| `/post/[id]` | nested dynamic route, `await` happens **inside** the `<Suspense>` child |
| `/flat` | top-level route, `await` inside the `<Suspense>` child |
| `/awaited/[id]` | nested dynamic route, `await` in the **page body**, outside `<Suspense>` (the reporter's actual code shape in `app/arts/[id]/page.js`) |
| `/awaited-flat` | same, top level |

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # port 3000
node test.mjs          # await inside boundary   (hard + soft nav)
node test2.mjs         # await outside boundary  (hard + soft nav)
```

The scripts print when the fallback text and the resolved data first appear in the DOM.

## Result (next 14.2.4 / react 18.2.0, and next 16.3.1 / react 19)

`test.mjs` — fallback shows immediately on both routes, nesting irrelevant:
```
{"nav":"hard","route":"post-nested-dynamic","fallbackVisibleAtMs":38,"dataAtMs":3024}
{"nav":"hard","route":"flat-toplevel","fallbackVisibleAtMs":21,"dataAtMs":2993}
{"nav":"soft","route":"post-nested-dynamic","fallbackVisibleAtMs":61,"dataAtMs":3049}
{"nav":"soft","route":"flat-toplevel","fallbackVisibleAtMs":53,"dataAtMs":3042}
```

`test2.mjs` — no fallback: fallback and data appear at the same time (hard nav) or never
(soft nav, router blocks for the full 3s), again identical for nested and top-level:
```
{"nav":"hard","route":"awaited-nested","fallbackVisibleAtMs":3094,"dataAtMs":3094}
{"nav":"hard","route":"awaited-flat","fallbackVisibleAtMs":3096,"dataAtMs":3096}
{"nav":"soft","route":"awaited-nested","fallbackVisibleAtMs":null,"dataAtMs":3140}
{"nav":"soft","route":"awaited-flat","fallbackVisibleAtMs":null,"dataAtMs":3126}
```

Conclusion: the missing fallback is caused by awaiting data in the page component
(outside the boundary), not by route nesting. In `app/arts/[id]/page.js` of the
reporter's app all `db.query`/`db.select` calls are awaited before the JSX with
`<Suspense>` is returned, whereas the working home page awaits inside the suspended
child component.
