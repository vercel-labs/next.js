import { headers } from 'next/headers';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const h = await headers();
  const entries = Array.from(h.entries()).sort(([a], [b]) => a.localeCompare(b));
  return (
    <div>
      <h1>Target: request headers</h1>
      <ul>{entries.map(([k, v]) => (<li key={k}><strong>{k}:</strong> {v}</li>))}</ul>
    </div>
  );
}
