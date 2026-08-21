import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function Test() {
  const c = await cookies();
  return (
    <main>
      <h1>Test</h1>
      <p id="rendered">cookie: {c.get('visit')?.value ?? 'none'} | rendered-at: {Date.now()}</p>
    </main>
  );
}
