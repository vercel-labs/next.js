# Reproduction: revalidatePath from a debounced Server Action fired after client navigation (vercel/next.js#70207)

The reporter's repo/CodeSandbox (`eduardodallmann/app-next-server-action-problem-2`) returns 404,
so this is a minimal rebuild of the reported scenario.

## Scenario

- `/events` (`force-dynamic`) renders a list from an in-memory store.
- `/events/[slug]` is the "drawer" with a debounced (2s) auto-save Server Action that calls
  `revalidatePath('/events')`.
- The "backdrop" button does `router.push('/events')`, i.e. it navigates away *before* the
  debounce timer fires. The pending Server Action still runs after the navigation.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # in one shell
npx playwright test    # in another
```

## Result

- `control` test (action fires *before* navigating away): list shows the new name -> passes.
- `bug` test (action fires *after* navigating away): `GET /api/events` proves the server state was
  written by the action, but the already-mounted `/events` page keeps rendering the stale name,
  so the test fails.

## Version matrix (next dev, same test)

| next | control | bug case |
| --- | --- | --- |
| 14.2.12 | pass | FAIL (stale list) |
| 15.3.9 | pass | FAIL (stale list) |
| 16.3.1 | pass | pass (list updates) |
