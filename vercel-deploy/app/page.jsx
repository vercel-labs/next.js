async function getData() {
  // Public endpoint whose response changes on every request (contains a `ts=` unix timestamp).
  const res = await fetch('https://cloudflare.com/cdn-cgi/trace', { next: { revalidate: 10 } });
  const text = await res.text();
  const ts = /ts=(.*)/.exec(text)?.[1] ?? 'unknown';
  return { ts };
}

export default async function Page() {
  const { ts } = await getData();
  return (
    <main>
      <p id="fetched">upstream ts (changes every real request): {ts}</p>
      <p id="rendered">renderedAt: {new Date().toISOString()}</p>
      <p>fetch was made with next: {'{'} revalidate: 10 {'}'}</p>
    </main>
  );
}
