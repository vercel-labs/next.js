export default async function Page() {
  await new Promise((r) => setTimeout(r, 300));
  return (
    <>
      <title>Metadata: Async Page</title>
      <h1>Async Page</h1>
    </>
  );
}
