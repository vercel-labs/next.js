export default async function HeaderPage({ params }: { params: Promise<{ segment: string }> }) {
  const { segment } = await params
  return <div id="header-slot">header slot: {segment}</div>
}
