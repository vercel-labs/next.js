// nft's only out-of-base protection for an emitted glob is
//   ignoreFn(path.relative(job.base, globBase)) -> startsWith('..' + path.sep)
// Show that it silently fails for the GitHub windows-latest drive layout.
const path = require('path')

const globBase = 'C:\\Users\\runneradmin\\**\\*'
for (const base of ['D:\\a\\project\\project', 'C:\\a\\project\\project']) {
  const rel = path.win32.relative(base, globBase)
  console.log(
    `base=${base}  relative=${JSON.stringify(rel)}  ignored=${rel.startsWith('..' + path.win32.sep)}`
  )
}
