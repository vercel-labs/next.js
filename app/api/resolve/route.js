import { dirname, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const resolved = require.resolve('highlight.js');
  const dir = resolve(dirname(resolved));
  const cssPath = resolve(dir, '../styles/default.css');
  let readError = null;
  try {
    readFileSync(cssPath, 'utf8');
  } catch (err) {
    readError = { code: err.code, syscall: err.syscall, path: err.path };
  }
  return Response.json({
    cwd: process.cwd(),
    __dirname: typeof __dirname !== 'undefined' ? __dirname : null,
    'require.resolve(highlight.js)': resolved,
    resolvedDir: dir,
    cssPath,
    existsSync: existsSync(cssPath),
    readError,
  });
}
