export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <p id="modal">MODAL intercepted vacancy {id}</p>
}
