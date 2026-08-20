export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

export default async function Page() {
  const base = 'http://127.0.0.1:3000';
  const forceCache = await (await fetch(base + '/api/time', { cache: 'force-cache' })).json();
  const noStore = await (await fetch(base + '/api/time', { cache: 'no-store' })).json();
  const def = await (await fetch(base + '/api/time')).json();
  return (
    <main>
      <pre id="out">{`force-cache=${forceCache.iso}\nno-store=${noStore.iso}\ndefault=${def.iso}\nrender=${new Date().toISOString()}`}</pre>
    </main>
  );
}
