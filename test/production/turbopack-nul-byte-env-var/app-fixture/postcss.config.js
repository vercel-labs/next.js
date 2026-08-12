// A PostCSS config makes Turbopack transform `app/globals.css` in a pooled
// Node.js child process, which is the spawn that fails when the environment
// contains a NUL byte.
module.exports = {
  plugins: [require('./postcss-noop-plugin.cjs')],
}
