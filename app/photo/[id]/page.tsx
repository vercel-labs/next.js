export default async function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div id="full-photo">Full page photo {id}</div>
}
