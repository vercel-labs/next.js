# Repro: next#83760 — CNA 15.5.3 postcss.config.mjs array format breaks @storybook/nextjs-vite

`create-next-app@15.5.3 --yes` (Tailwind) generates:

```js
const config = { plugins: ["@tailwindcss/postcss"] };
```

Vite-based Storybook (`@storybook/nextjs-vite`) rejects this array format.

## Run

```bash
pnpm install
pnpm run storybook
```

Observed: `SB_FRAMEWORK_NEXTJS_0003 (IncompatiblePostCssConfigError)` / `Invalid PostCSS Plugin found at: plugins[0]`, "Broken build, fix the error above."

Switching `postcss.config.mjs` to the object form (`plugins: { "@tailwindcss/postcss": {} }`) makes Storybook start on :6006 (HTTP 200).

Note: `create-next-app@16.3.1` (and canary) templates already emit the object form; the array form ships in the 15.5.x templates.
