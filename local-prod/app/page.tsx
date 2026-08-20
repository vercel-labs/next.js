async function getData() {
  const res = await fetch('http://127.0.0.1:3001/data', { next: { revalidate: 5 } });
  return res.json();
}
export default async function Page() {
  const data = await getData();
  return (
    <main>
      <p id="value">value: {data.value}</p>
      <p id="servedAt">backend servedAt: {data.servedAt}</p>
      <p id="renderedAt">rendered at: {new Date().toISOString()}</p>
    </main>
  );
}
