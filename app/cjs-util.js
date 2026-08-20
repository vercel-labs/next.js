// Plain CommonJS module that assigns to `this` at module scope. Modules like this
// (common in transpiled npm packages) make webpack emit the
// `__webpack_modules__[moduleId].call(module.exports, ...)` form in the runtime chunk,
// which is the exact frame reported in the issue.
this.label = function label() {
  return "cjs util loaded"
}
