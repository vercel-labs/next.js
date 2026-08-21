export default async function Page({ params }: { params: Promise<{ segment: string }> }) {
  const { segment } = await params
  return <div id="children-slot">children slot: {segment}</div>
}
