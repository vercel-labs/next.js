// Executable model of the two `isResourceInPackages` implementations that decide
// whether a `transpilePackages` entry is bundled (true) or externalized (false)
// on the pages-router server compilation.
//
// - webpack (JS): packages/next/src/build/handle-externals.ts  -> uses path.sep
// - next-rspack (Rust): rspack/crates/binding/src/handle_externals.rs
//     `resource.starts_with(&format!("{dir}/"))`   <- hard-coded "/"
//     `resource.contains(&format!("/node_modules/{}/", pkg.replace('/', MAIN_SEPARATOR_STR)))`
//        ^ hard-coded "/" around a separator-normalized package name
import path from 'node:path'

function jsImpl(resource, pkgs, dirMap, sep) {
  return pkgs.some((p) =>
    dirMap.has(p)
      ? resource.startsWith(dirMap.get(p) + sep)
      : resource.includes(
          sep + ['node_modules', p.split('/').join(sep)].join(sep) + sep
        )
  )
}

function rustImpl(resource, pkgs, dirMap, MAIN_SEPARATOR) {
  return pkgs.some((p) => {
    if (dirMap.has(p)) return resource.startsWith(dirMap.get(p) + '/')
    return resource.includes('/node_modules/' + p.split('/').join(MAIN_SEPARATOR) + '/')
  })
}

const cases = [
  {
    platform: 'win32 (pnpm junction / .pnpm virtual store)',
    sep: '\\',
    resource:
      'C:\\repro\\node_modules\\.pnpm\\@demo+service@file+vendor+demo-service-1.0.0.tgz\\node_modules\\@demo\\service\\index.js',
    dir: 'C:\\repro\\node_modules\\.pnpm\\@demo+service@file+vendor+demo-service-1.0.0.tgz\\node_modules\\@demo\\service',
  },
  {
    platform: 'linux/macOS',
    sep: '/',
    resource:
      '/repro/node_modules/.pnpm/@demo+service@file+vendor+demo-service-1.0.0.tgz/node_modules/@demo/service/index.js',
    dir: '/repro/node_modules/.pnpm/@demo+service@file+vendor+demo-service-1.0.0.tgz/node_modules/@demo/service',
  },
]

const pkgs = ['@demo/di-core', '@demo/service']
let bad = false
for (const c of cases) {
  const dirMap = new Map([['@demo/service', c.dir]])
  const webpack = jsImpl(c.resource, pkgs, dirMap, c.sep)
  const rspack = rustImpl(c.resource, pkgs, dirMap, c.sep)
  // with an empty dir mapping (resolution miss) the fallback substring test is used
  const webpackFallback = jsImpl(c.resource, pkgs, new Map(), c.sep)
  const rspackFallback = rustImpl(c.resource, pkgs, new Map(), c.sep)
  console.log(`\n${c.platform}  (path.sep = ${JSON.stringify(c.sep)})`)
  console.log(`  resource: ${c.resource}`)
  console.log(`  dir-mapping match  -> webpack(JS): ${webpack}   next-rspack(Rust): ${rspack}`)
  console.log(`  fallback substring -> webpack(JS): ${webpackFallback}   next-rspack(Rust): ${rspackFallback}`)
  console.log(
    `  => transpilePackages entry is ${rspack ? 'BUNDLED' : 'EXTERNALIZED (require() at runtime)'} by next-rspack`
  )
  if (webpack !== rspack) bad = true
}
console.log(
  `\nresult: ${bad ? 'MISMATCH between webpack and next-rspack on win32 paths (bug)' : 'no mismatch'}`
)
process.exitCode = bad ? 1 : 0
