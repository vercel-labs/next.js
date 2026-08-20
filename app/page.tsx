export const revalidate = 10;

export default async function Page() {
  const rendered = new Date().toISOString();
  console.log("[repro] rendering page at", rendered);
  return (
    <main>
      <h1>ISR revalidate repro (issue 61923)</h1>
      <p id="rendered">rendered-at: {rendered}</p>
      <p>revalidate = 10</p>
    </main>
  );
}
