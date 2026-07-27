import {createServer} from 'node:http';
import {createReadStream, statSync} from 'node:fs';
import {extname, resolve, sep} from 'node:path';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const staticRoot = resolve('.next/static');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
};

const cdn = createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const relativePath = pathname.replace(/^\/_next\/static\/?/, '');
  const filePath = resolve(staticRoot, relativePath);

  if (!pathname.startsWith('/_next/static/') || !filePath.startsWith(`${staticRoot}${sep}`)) {
    response.writeHead(404).end('Not found');
    return;
  }

  try {
    const stat = statSync(filePath);
    if (!stat.isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': stat.size,
      'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

cdn.listen(4000, 'localhost', () => {
  console.log('Cross-site chunk server: http://localhost:4000');
});

const next = spawn(
  process.execPath,
  [require.resolve('next/dist/bin/next'), 'start', '--hostname', '127.0.0.1'],
  {stdio: 'inherit'},
);

function shutdown(signal) {
  next.kill(signal);
  cdn.close();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
next.on('exit', (code, signal) => {
  cdn.close();
  process.exitCode = code ?? (signal ? 1 : 0);
});
