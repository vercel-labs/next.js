// Minimal stand-in for `-r esm`: compile CJS modules with vm.Script and no
// importModuleDynamically callback, exactly like esm@3.2.25's loader does.
const fs = require('fs')
const vm = require('vm')
const path = require('path')
const Module = require('module')

require.extensions['.js'] = function (mod, filename) {
  const source = fs.readFileSync(filename, 'utf8')
  const wrapper = Module.wrap(source)
  const script = new vm.Script(wrapper, { filename }) // no importModuleDynamically
  const fn = script.runInThisContext()
  const req = mod.require.bind(mod)
  req.resolve = (r) => Module._resolveFilename(r, mod)
  req.cache = require.cache
  req.extensions = require.extensions
  req.main = process.mainModule
  fn.call(mod.exports, mod.exports, req, mod, filename, path.dirname(filename))
}
