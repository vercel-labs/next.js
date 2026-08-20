export const dynamic = 'force-dynamic'; // the page itself is never cached

export default async function Page() {
  const noOpts = await (await fetch('http://127.0.0.1:3999/no-options')).json();
  const forceCache = await (
    await fetch('http://127.0.0.1:3999/force-cache', { cache: 'force-cache' })
  ).json();
  return (
    <main>
      <p id="no-options">{`no-options -> hits=${noOpts.hits} time=${noOpts.time}`}</p>
      <p id="force-cache">{`force-cache -> hits=${forceCache.hits} time=${forceCache.time}`}</p>
    </main>
  );
}
