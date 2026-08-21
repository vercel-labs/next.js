export async function generateMetadata({ params }) {
  const { id } = await params;
  console.log(`generateMetadata called for id=${id}`);
  return { title: `Page ${id}` };
}

export default async function Page({ params }) {
  const { id } = await params;
  console.log(`page render for id=${id}`);
  await new Promise((r) => setTimeout(r, 500));
  return <h1 id="item">Item {id}</h1>;
}
