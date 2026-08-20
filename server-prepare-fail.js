import next from 'next';

// Force app.prepare() to reject: dir does not exist
const app = next({ dev: true, dir: '/nonexistent-dir-47211', hostname: 'localhost', port: 3001 });

try {
  await app.prepare();
} catch (err) {
  throw err; // rethrowing: is the error surfaced?
}
