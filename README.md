# Reproduction: revalidatePath in a Server Function + client-side `router.push` re-renders the old (deleted) page

Issue: https://github.com/vercel/next.js/issues/83382

The reporter's linked repo (`schimi-dev/router-push-after-delete-404`) returns 404, so this is a
minimal re-creation on the reported version `next@15.5.1-canary.24`.

## Run

```bash
npm install
npm run dev   # or: npm run build && npm run start
node test.mjs # optional Playwright driver (requires `npx playwright install chromium`)
```

Manual steps:
1. Open http://localhost:3000
2. Submit "Add Item"
3. Click the item link -> `/items/1`
4. Click **Delete with client-side router.push - Bug**

## Observed (server log)

```
[render] /items/1 -> found
GET /items/1 200
[action] deleteItemAction(1)
[render] /items/1 -> NOT FOUND (404)   <-- old page re-rendered after navigating away
POST /items/1 200
[render] / (home)
```

Control: **Delete with server-side redirect - OK** (`revalidatePath` + `redirect` in the Server Action)
never re-renders `/items/1`.
