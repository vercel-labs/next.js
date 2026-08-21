export default async function Photo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div id="page">full-photo-{id}</div>
}
