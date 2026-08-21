// Set NOOP_LOG=1 to also load the instrumentation plugin that logs, for every
// PostCSS invocation, whether the `content` Turbopack passed matches the file on
// disk and what mtime the worker observes (written to /tmp/noop.log).
const plugins = {};
if (process.env.NOOP_LOG) {
  plugins[new URL("./postcss-noop.cjs", import.meta.url).pathname] = {};
}
plugins["@tailwindcss/postcss"] = {};

export default { plugins };
