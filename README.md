# Repro: next.js#66353 — `<select>` reverts to old value after Server Action form submit

Minimal reproduction of https://github.com/vercel/next.js/issues/66353
(original report used `vercel/next-learn` dashboard/final-example with the `redirect()` removed).

## Setup
```bash
npm install
npm run dev   # or: npm run build && npm run start
```
Open http://localhost:3000

## Steps
1. Change the `<select>` from "Customer A" to "Customer C" and type into the text input.
2. Click **Edit Invoice** (Server Action saves to the in-memory store, calls `revalidatePath('/')`, no `redirect()`).

## Actual (next 15.x / 16.x + React 19)
The `<select>` snaps back to the *old* value ("Customer A") even though the page text
shows `server customerId: c`. The text `<input>` keeps its value. A manual page reload
shows the correct option.

## Expected (next 14.2.35 + React 18)
The `<select>` keeps the newly selected value after submitting.

Verified with Playwright:

| version | select after submit | input after submit |
| --- | --- | --- |
| next 14.2.35 / react 18.3.1 | `c` (kept) | `typed-name` |
| next 16.3.1 / react 19.2.0 (dev & start) | `a` (reverted) | `typed-name` |
