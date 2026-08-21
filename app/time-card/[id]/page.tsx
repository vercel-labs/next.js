export default async function TimeCard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <h1>Time card {id}</h1>
}
