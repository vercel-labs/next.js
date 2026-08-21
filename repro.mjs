// Reproduction for https://github.com/vercel/next.js/issues/92339
//
// `next build` with `output: 'export'` copies RSC segment files from
// `.next/server/app/<route>.segments/**` into `out/<route>/`, naming each file
// with convertSegmentPathToStaticExportFilename(). The segment path is computed
// with path.relative(), which returns backslashes on Windows, and the filename
// helper only replaces forward slashes. The remaining backslashes are then
// treated as directory separators by fs/path.join, so on Windows the file lands
// in a nested directory that the client router never requests.
//
// Run: npm run repro   (works on any OS; the win32 case is emulated)
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { convertSegmentPathToStaticExportFilename } from 'next/dist/shared/lib/segment-cache/segment-value-encoding.js'

const RSC_SEGMENT_SUFFIX = '.segment.rsc'
const segmentsDir = path.join('.next', 'server', 'app', 'foo', 'bar.segments')

async function collect(dir, out = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) await collect(p, out)
    else if (e.name.endsWith(RSC_SEGMENT_SUFFIX)) out.push(p)
  }
  return out
}

const files = await collect(segmentsDir)
let failures = 0

// what the client router fetches; always forward slashes
// (client/components/segment-cache/cache.ts -> addSegmentPathToUrlInOutputExportMode)
const requestedFiles = files.map((file) =>
  convertSegmentPathToStaticExportFilename(
    '/' + path.relative(segmentsDir, file).split(path.sep).join('/').slice(0, -RSC_SEGMENT_SUFFIX.length)
  )
)

for (const impl of ['posix', 'win32']) {
  const p = path[impl]
  const toImpl = (f) => f.split(path.sep).join(p.sep)
  console.log(`\n--- path.${impl} (Node's path on ${impl === 'win32' ? 'Windows' : 'Linux/macOS'}) ---`)
  files.forEach((file, i) => {
    // exact logic of packages/next/src/export/index.ts
    const segmentFileSrc = p.relative(toImpl(segmentsDir), toImpl(file))
    const segmentPath = '/' + segmentFileSrc.slice(0, -RSC_SEGMENT_SUFFIX.length)
    const segmentFilename = convertSegmentPathToStaticExportFilename(segmentPath)
    const writtenRel = p.join('foo', 'bar', segmentFilename).split(p.sep).join('/')
    const requestedRel = 'foo/bar/' + requestedFiles[i]
    const ok = writtenRel === requestedRel
    if (!ok) failures++
    console.log(`${ok ? 'OK  ' : 'BAD '} written to out/${writtenRel}`)
    if (!ok) console.log(`     router requests /${requestedRel} -> 404`)
  })
}

// Also print what this machine actually produced in out/
const actual = []
await (async function walk(d) {
  for (const e of await fs.readdir(d, { withFileTypes: true })) {
    if (e.isDirectory()) await walk(path.join(d, e.name))
    else actual.push(path.join(d, e.name))
  }
})(path.join('out', 'foo', 'bar'))
console.log('\n--- actual out/foo/bar contents on this machine ---')
console.log(actual.filter((f) => f.includes('__next')).sort().join('\n'))

console.log(
  failures > 0
    ? `\nREPRODUCED: ${failures} segment file(s) are written to a path the client router never requests.`
    : '\nNot reproduced.'
)
process.exit(failures > 0 ? 1 : 0)
