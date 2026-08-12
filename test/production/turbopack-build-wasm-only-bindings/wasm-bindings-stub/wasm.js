// Minimal stand-in for the `@next/swc-wasm-nodejs` bindings, loaded through
// `NEXT_TEST_WASM_DIR`. It only needs to exist: the test asserts that
// `next build` bails out before any of these bindings are used, because
// Turbopack requires the native bindings.
module.exports = new Proxy(
  {},
  {
    get(_target, property) {
      throw new Error(
        `The stub wasm bindings do not implement \`${String(property)}\`.`
      )
    },
  }
)
