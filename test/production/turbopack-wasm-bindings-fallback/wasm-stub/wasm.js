// A stand-in for `@next/swc-wasm-nodejs`, loaded through `NEXT_TEST_WASM_DIR`.
//
// It emulates a machine where the native `@next/swc-*` binding cannot be
// loaded (e.g. a glibc < 2.29 host such as RHEL 8) and Next.js therefore falls
// back to the WebAssembly bindings. None of these methods should be reached by
// this test: the build is expected to bail out before any compilation happens.
const notImplemented = (name) => () => {
  throw new Error(`\`${name}\` is not implemented by the wasm test stub.`)
}

module.exports = {
  transform: notImplemented('transform'),
  transformSync: notImplemented('transformSync'),
  minify: notImplemented('minify'),
  minifySync: notImplemented('minifySync'),
  parse: notImplemented('parse'),
  mdxCompile: notImplemented('mdxCompile'),
  mdxCompileSync: notImplemented('mdxCompileSync'),
  expandNextJsTemplate: notImplemented('expandNextJsTemplate'),
  codeFrameColumns: () => undefined,
}
