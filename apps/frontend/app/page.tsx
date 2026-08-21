import { greet } from '@repo/common';

export default function Home() {
  const message = greet('World');

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Turbopack Monorepo Bug Reproduction</h1>
      <p>Message from @repo/common: <strong>{message}</strong></p>
    </main>
  );
}
