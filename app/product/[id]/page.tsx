export default async function Product({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <p>product {id}</p>
}
