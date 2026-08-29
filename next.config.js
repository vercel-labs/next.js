// Minimal reproduction of vercel/next.js#98071
//
// Any error thrown by a webpack loader running through Turbopack's
// webpack-loader bridge is serialized with `stacktrace-parser`, which returns
// `file: null` for "native" stack frames. The Rust side deserializes stack
// frames into `StackFrame { file: Cow<str> }` (NOT Option), so the whole build
// dies with a FATAL Turbopack panic
// ("invalid type: null, expected a string" / evaluate_webpack_loader failed)
// instead of reporting the loader error.
module.exports = {
  turbopack: {
    rules: {
      '**/*.thing.js': {
        as: '*.js',
        loaders: [require.resolve('./broken-loader.cjs')],
      },
    },
  },
}
