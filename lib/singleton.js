// A plain module that must be evaluated only once per process (ESM/CJS semantics).
const pid = globalThis.process?.pid
globalThis.__singletonEvals = (globalThis.__singletonEvals ?? 0) + 1
const value = Math.random()
console.log(
  `[singleton] module evaluated -> evals-in-this-process=${globalThis.__singletonEvals} pid=${pid} value=${value} loader=${
    typeof __webpack_require__ === 'undefined' ? 'node-cjs' : 'webpack'
  }`
)
export default { value }
