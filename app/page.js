// Build-time (SSG) data fetch with a long revalidate, like the reports in the issue.
export default async function Page() {
  const res = await fetch('http://localhost:3999/api', { next: { revalidate: 86400 } });
  const data = await res.json();
  return (
    <main>
      <h1 id="value">{data.value}</h1>
      <p id="built">fetched-at: {data.at}</p>
    </main>
  );
}
