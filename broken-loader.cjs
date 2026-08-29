// A loader that fails "normally". Under a JSC-based runtime (bun, which the
// original reporter used as the build runner) the resulting stack contains a
// frame like `at forEach (native:1:11)`; stacktrace-parser maps that to
// { file: null } and Turbopack panics while serializing the loader issue.
module.exports = function brokenLoader(source) {
  ;[1].forEach(function throwsInsideNativeFrame() {
    throw new Error('loader failed on purpose')
  })
  return source
}
