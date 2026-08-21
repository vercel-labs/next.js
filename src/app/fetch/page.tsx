export default async function FetchPage() {
  await fetch('http://localhost:4000/', {
    signal: AbortSignal.timeout(1000),
  });
  return (
    <div>
      <h1>Fetch Page</h1>
    </div>
  );
}
