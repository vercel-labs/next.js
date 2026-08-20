export default async function Blog({ params, searchParams }) {
  const p = await params;
  const s = await searchParams;
  return (
    <div>
      <h1>blog</h1>
      <pre id="params">params={JSON.stringify(p)}</pre>
      <pre id="search">searchParams={JSON.stringify(s)}</pre>
    </div>
  );
}
