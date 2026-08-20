import next from 'next';

const app = next({
  dev: process.env.NODE_ENV !== 'production',
  hostname: 'localhost',
  port: 3000,
});

await app.prepare();

throw new Error('I am swallowed');
