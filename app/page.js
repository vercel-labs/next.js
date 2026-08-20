export const dynamic = 'force-dynamic';

export default async function Page() {
  console.log('[repro] fetching');
  const response = await fetch('https://example.com', { cache: 'no-store' });
  console.log('[repro] fetched, status', response.status, 'cancelling body');
  await response.body?.cancel();
  console.log('[repro] cancelled');
  return <p>status: {response.status}</p>;
}
