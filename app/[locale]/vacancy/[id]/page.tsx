export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <p id="full-page">FULL PAGE vacancy {id}</p>
}
