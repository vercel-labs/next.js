import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const c = await cookies();
  return (
    <main>
      <h1>Home (force-dynamic)</h1>
      <p id="rendered">cookie: {c.get('visit')?.value ?? 'none'} | rendered-at: {Date.now()}</p>
    </main>
  );
}
