/** @type {import("next").NextConfig} */
export default {
  // Workaround (webpack only): uncomment to resolve `.js` specifiers to `.ts`/`.tsx`.
  // Turbopack ignores this and still fails with "Can't resolve './Button.js'".
  // experimental: { extensionAlias: { ".js": [".ts", ".tsx", ".js", ".jsx"] } },
};
