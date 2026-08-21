export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <p>plain id page: {id}</p>;
}
