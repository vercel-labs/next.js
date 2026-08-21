// Emulates the win32 output of `next build` with `output: 'export'`.
//
// next/dist/export/index.js collects RSC segment paths with path.relative(), then
// feeds them to convertSegmentPathToStaticExportFilename(), which only maps the
// POSIX separator "/" to ".". On Windows path.relative() returns "\"-separated
// paths, so nested segments keep a "\" in the filename and the copy therefore
// lands in a *nested directory* instead of the flat, dot-joined file that the
// client router requests.
//
// Running this script on a Linux/macOS `out/` directory produces exactly the
// layout a real Windows build produces (verified against the reporter's deployed
// artifact, e.g. Aaakul.github.io tree entry `next16/page/__next.page/__PAGE__.txt`),
// which makes the 404s reproducible on any OS.
import { readdir, mkdir, rename } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.join(process.cwd(), 'out');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.startsWith('__next.') && e.name.endsWith('.txt')) {
      // "__next.a.b.__PAGE__.txt" -> "__next.a/b/__PAGE__.txt" (win32 behaviour:
      // only the leading "/" of the segment path became ".", the rest stayed "\")
      const body = e.name.slice('__next.'.length, -'.txt'.length);
      const parts = body.split('.');
      if (parts.length < 2) continue;
      const dest = path.join(dir, '__next.' + parts[0], ...parts.slice(1)) + '.txt';
      await mkdir(path.dirname(dest), { recursive: true });
      await rename(p, dest);
      console.log('win32 layout:', path.relative(outDir, p), '->', path.relative(outDir, dest));
    }
  }
}
await walk(outDir);
