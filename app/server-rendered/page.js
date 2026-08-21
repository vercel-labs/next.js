import RefreshButton from './refresh-button';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = { timestamp: new Date().toISOString(), random: Math.random() };
  return (
    <div>
      <h1 id="out">Data from server: {JSON.stringify(data)}</h1>
      <RefreshButton />
    </div>
  );
}
