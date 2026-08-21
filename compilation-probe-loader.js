// Probe loader: reports whether `this._compilation` is available and whether the
// same object identity is shared across loader invocations of one pass.
const seen = new WeakMap();
let nextId = 1;

module.exports = function compilationProbeLoader(source) {
  const compilation = this._compilation;
  let id = "undefined (no _compilation on loader context)";
  if (compilation) {
    if (!seen.has(compilation)) seen.set(compilation, nextId++);
    id = "compilation#" + seen.get(compilation);
  }
  console.log(
    `[probe] file=${require("path").basename(this.resourcePath)} ` +
      `typeof this._compilation=${typeof compilation} identity=${id}`
  );
  return source;
};
