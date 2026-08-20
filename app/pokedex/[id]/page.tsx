export default async function Pokemon({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <p>{id}</p>
}
